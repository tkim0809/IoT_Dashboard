import time
import boto3
import json
import argparse
from botocore.exceptions import NoCredentialsError
from botocore.exceptions import ClientError

# Initialize the S3 client
s3 = boto3.client('s3')
status_bucket = 'isu-status'
media_bucket = 'isu-media'
# base_prefix = 'demo/N222/20240926'
base_prefix = 'united/boeing_737/boeing_737_max_8'

# Demo configurables
interval_seconds = 5
total_seconds = 120
percent_update = interval_seconds / total_seconds


def get_file_size(file_key):
    try:
        response = s3.head_object(Bucket=media_bucket, Key=f"skywave/20240926/{file_key}.tgz")        
        return response["ContentLength"]        
    except ClientError as e:
        print(f"Error getting metadata for {file_key}: {e}")
        return None

def list_contents():
    """Fetch campaign.json contents."""
    campaign_json_key = "skywave/20240926/campaign.json"
    try:
        obj = s3.get_object(Bucket=media_bucket, Key=campaign_json_key)
        content = obj['Body'].read().decode('utf-8')        
        campaign_data = json.loads(content)
        contents = campaign_data.get("priority", {}).get("medium", [])
        return contents
    except s3.exceptions.NoSuchKey:
        print("campaign.json file not found.")
        return []
    except Exception as e:
        print(f"Error retrieving or parsing campaign.json: {e}")
        return []

def read_progress_file(content, tail):
    """Read the number from a .progress file."""
    try:
        obj = s3.get_object(Bucket=status_bucket, Key=f"{base_prefix}/{tail}/{content}.progress")
        content = obj['Body'].read().decode('utf-8').strip()
        return int(content)
    except (s3.exceptions.NoSuchKey, ValueError):
        print(f"Could not read progress from {content}.")
        return 0

def write_progress_file(content, tail, value):
    """Write a new number to a .progress file."""
    try:
        s3.put_object(Bucket=status_bucket, Key=f"{base_prefix}/{tail}/{content}.progress", Body=str(value))
    except NoCredentialsError:
        print("No AWS credentials found.")
    except Exception as e:
        print(f"Failed to write to {content}: {e}")

def update_progress_files():
    """Incrementally update each .progress file over time."""
    contents = list_contents()
    print(f"Contents: {contents}")
    elapsed = 0
    increments = {}
    for file_key in contents:
        file_size = get_file_size(file_key)
        if file_size is not None:
            increments[file_key] = {
                'increment': file_size * percent_update,
                'max_size': file_size
            }

    while elapsed < total_seconds: # 2 minutes
        print(f"Time: {elapsed}")
        for file_key in increments.keys():
            current_value = read_progress_file(file_key, 'N100')
            current_value2 = read_progress_file(file_key, 'N200')
            if current_value >= increments[file_key]['max_size']:
                print(f"{file_key}: {current_value} -- Finished")
                continue
            new_value = int(current_value + increments[file_key]['increment'])
            new_value_2 = int(current_value2 + (increments[file_key]['increment'] * 0.5))
            write_progress_file(file_key, 'N100', new_value)
            write_progress_file(file_key, 'N200', new_value_2)
            print(f"{file_key}: {new_value} {new_value_2}")
        elapsed += interval_seconds
        time.sleep(interval_seconds)

def reset():
    """Delete all .progress files in the base_prefix and create a new .progress file for each campaign."""
    # List all .progress files under the base_prefix
    response = s3.list_objects_v2(Bucket=status_bucket, Prefix=f"{base_prefix}/N100")
    response2 = s3.list_objects_v2(Bucket=status_bucket, Prefix=f"{base_prefix}/N200")
    if 'Contents' in response or 'Contents' in response2:
        keys_to_delete = [{'Key': obj['Key']} for obj in response['Contents']]
        keys_to_delete2 = [{'Key': obj['Key']} for obj in response['Contents']]
        print("Keys to delete: ", keys_to_delete, keys_to_delete2)
        s3.delete_objects(Bucket=status_bucket, Delete={'Objects': keys_to_delete})
        s3.delete_objects(Bucket=status_bucket, Delete={'Objects': keys_to_delete2})
        print(f"Deleted {len(keys_to_delete)} objects under the prefix '{base_prefix}'.")
    else:
        print(f"No objects found under the prefix '{base_prefix}'.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Choose operation: reset or run.")
    parser.add_argument('operation', choices=['run', 'reset'], help="Specify whether to run progress update or reset progress files.")

    args = parser.parse_args()

    if args.operation == 'reset':
        reset()
    elif args.operation == 'run':
        update_progress_files()