require('dotenv').config();
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const checkS3Bucket = async (bucketName, prefix = '') => {
  try {
    console.log(`Checking connection to bucket '${bucketName}' with prefix '${prefix}'`);
    const data = await s3.send(new ListObjectsV2Command({ Bucket: bucketName, Prefix: prefix }));

    console.log(`S3 connected successfully to bucket: ${bucketName}`);
    console.log(`Found ${data.Contents ? data.Contents.length : 0} objects with prefix '${prefix}' in bucket: ${bucketName}`);
  } catch (err) {
    console.error(`S3 connection error for bucket ${bucketName} with prefix '${prefix}':`, err.message);
  }
};

const checkS3Connection = async () => {
  await checkS3Bucket(process.env.S3_BUCKET_STATUS_NAME, 'united/boeing_737/boeing_737_max_8/N100/');
  await checkS3Bucket(process.env.S3_BUCKET_MEDIA_NAME, 'skywave/20240926/');
};

const readFileFromBucket = async (bucketName, key) => {
  try {
    const params = { Bucket: bucketName, Key: key };
    const data = await s3.send(new GetObjectCommand(params));

    const content = await streamToString(data.Body);
    return parseInt(content, 10);
  } catch (err) {
    console.error(`Failed to read key '${key}' from bucket '${bucketName}':`, err.message);
    return 0;
  }
};

const streamToString = (stream) => new Promise((resolve, reject) => {
  const chunks = [];
  stream.on('data', chunk => chunks.push(chunk));
  stream.on('error', reject);
  stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
});

const listFilesInBucket = async (bucketName, prefix = '', suffix = '') => {
  try {
    console.log(`Fetching directories from bucket '${bucketName}' with prefix '${prefix}'`);
    const params = {
      Bucket: bucketName,
      Prefix: prefix || '', // Ensure no undefined prefixes are passed
      Delimiter: '/', // Fetch only prefixes (directories)
    };
    const data = await s3.send(new ListObjectsV2Command(params));

    if (data.CommonPrefixes && Array.isArray(data.CommonPrefixes)) {
      return data.CommonPrefixes.map(item => item.Prefix);
    } else {
      console.log(`No directories found in bucket '${bucketName}' with prefix '${prefix}'`);
      return [];
    }
  } catch (err) {
    console.error(`Error listing directories in bucket '${bucketName}':`, err.message);
    throw err;
  }
};

const parseFileInfo = (key) => {
  const parts = key.split('/');
  const airline = parts[0];
  const fleet = parts[1];
  const subfleet = parts[2];
  const tailID = parts[3];
  const contentName = parts[parts.length - 1].split('.')[0];
  return { airline, fleet, subfleet, tailID, contentName };
};


const listFilesInDirectory = async (bucketName, prefix = '', suffix = '') => {
  try {
    console.log(`Fetching files from bucket '${bucketName}' with prefix '${prefix}'`);
    const params = {
      Bucket: bucketName,
      Prefix: prefix || '', // Ensure no undefined prefixes are passed
    };

    const data = await s3.send(new ListObjectsV2Command(params));

    if (data.Contents && Array.isArray(data.Contents)) {
      // If a suffix is provided, filter files based on the suffix
      return data.Contents.filter(item => (suffix ? item.Key.endsWith(suffix) : true));
    } else {
      console.log(`No files found in bucket '${bucketName}' with prefix '${prefix}'`);
      return [];
    }
  } catch (err) {
    console.error(`Error listing files in bucket '${bucketName}':`, err.message);
    throw err;
  }
};


const calculateProgress = async (progressFiles, mediaFiles) => {
  const results = [];

  for (const progressFile of progressFiles) {
    try {
      const { airline, fleet, subfleet, tailID, contentName } = parseFileInfo(progressFile.Key);

      // Find the corresponding media file
      const mediaFile = mediaFiles.find(file => file.Key.includes(`${contentName}.tgz`));

      if (!mediaFile) {
        console.warn(`No corresponding media file found for '${contentName}' in media bucket.`);
        continue;
      }

      const totalSize = mediaFile.Size;

      // Read the downloaded bytes from the progress file
      const bytesDownloaded = await readFileFromBucket(process.env.S3_BUCKET_STATUS_NAME, progressFile.Key);
      const progressPercentage = ((bytesDownloaded / totalSize) * 100).toFixed(2);
      const status = bytesDownloaded === totalSize ? 'Completed' : 'In progress';

      // Add progress data to results
      results.push({
        contentName,
        airline,
        fleet,
        subfleet,
        tailID,
        downloadedBytes: bytesDownloaded,
        totalSize,
        progress: `${progressPercentage}%`,
        status,
      });
    } catch (error) {
      console.error(`Error processing .progress file '${progressFile.Key}':`, error.message);
    }
  }

  return results;
};

const getProgressData = async (airline, fleet, subfleet, tailID) => {
  try {
    console.log(`Fetching .progress files for '${airline}/${fleet}/${subfleet}/${tailID}':`);

    // Fetch .progress files from the status bucket
    const progressFiles = await listFilesInDirectory(
      process.env.S3_BUCKET_STATUS_NAME,
      `${airline}/${fleet}/${subfleet}/${tailID}/`,
      '.progress'
    );

    if (!progressFiles.length) {
      console.log(`No .progress files found for '${airline}/${fleet}/${subfleet}/${tailID}' in the status bucket.`);
      return [];
    }

    // Use the fixed path for media files
    const fixedCampaignPath = 'skywave/20240926/';
    console.log(`Fetching media files from fixed path '${fixedCampaignPath}' in the media bucket.`);
    const mediaFiles = await listFilesInDirectory(
      process.env.S3_BUCKET_MEDIA_NAME,
      fixedCampaignPath,
      '.tgz'
    );

    if (!mediaFiles.length) {
      console.log(`No media files found in the fixed path '${fixedCampaignPath}' in the media bucket.`);
      return [];
    }

    // Calculate progress using progress and media files
    const progressData = await calculateProgress(progressFiles, mediaFiles);

    return progressData;
  } catch (error) {
    console.error(`Error fetching .progress data for '${airline}/${fleet}/${subfleet}/${tailID}':`, error.message);
    throw error;
  }
};




const listAllAirlines = async () => {
  try {
    const prefixes = await listFilesInBucket(process.env.S3_BUCKET_STATUS_NAME, '', '/');

    // Extract airline names by removing trailing slash
    const airlines = prefixes.map(prefix => prefix.replace(/\/$/, ''));

    return airlines;
  } catch (error) {
    console.error("Error listing all airlines:", error.message);
    throw error;
  }
};

// Function to list all unique tailID in the S3 bucket
const listAllFleets = async (airline) => {
  if (!airline) {
    console.error('Airline parameter is undefined!');
    return []; // Return an empty array or throw an error
  }
  try {
    const prefixes = await listFilesInBucket(process.env.S3_BUCKET_STATUS_NAME, `${airline}/`, '/');
    const fleets = prefixes.map(prefix => prefix.split('/')[1]).filter(Boolean);
    return fleets;
  } catch (error) {
    console.error("Error listing all fleets for airline:", airline, error.message);
    throw error;
  }
};

const listAllSubfleets = async (airline, fleet) => {
  if (!airline || !fleet) {
    console.error(`Invalid parameters: airline='${airline}', fleet='${fleet}'`);
    return []; // Return an empty array or throw an error
  }

  try {
    console.log(`Fetching subfleets for airline '${airline}' and fleet '${fleet}'`);
    const prefixes = await listFilesInBucket(process.env.S3_BUCKET_STATUS_NAME, `${airline}/${fleet}/`, '/');

    // Extract subfleets and calculate tailID data
    const subfleetData = await Promise.all(
      prefixes.map(async (prefix) => {
        const subfleet = prefix.split('/')[2]; // Extract subfleet name
        if (!subfleet) return null;

        // List all tail IDs for this subfleet
        const tailIDs = await listAllTailIDs(airline, fleet, subfleet);

        // Fetch progress data for each tailID and aggregate totals
        let totalDownloaded = 0;
        let totalSize = 0;

        const tailIDStatuses = await Promise.all(
          tailIDs.map(async (tailID) => {
            const progressData = await getProgressData(airline, fleet, subfleet, tailID);

            // Aggregate downloaded bytes and total size
            totalDownloaded += progressData.reduce((sum, item) => sum + item.downloadedBytes, 0);
            totalSize += progressData.reduce((sum, item) => sum + item.totalSize, 0);

            // Determine status
            const isComplete = progressData.every((item) => item.status === 'Completed');
            const isInProgress = progressData.some((item) => item.status === 'In progress');

            return {
              tailID,
              isComplete,
              isInProgress,
            };
          })
        );

        // Calculate completion percentage for the subfleet
        const completionPercentage = totalSize > 0 ? ((totalDownloaded / totalSize) * 100).toFixed(2) : 0;

        // Calculate overall counts
        const finishedCount = tailIDStatuses.filter((status) => status.isComplete).length;
        const inProgressCount = tailIDStatuses.filter((status) => status.isInProgress).length;

        return {
          subfleet,
          tailIDCount: tailIDs.length,
          tailIDFinished: finishedCount,
          tailIDInProgress: inProgressCount,
          completionPercentage: `${completionPercentage}%`, // Add completion percentage for subfleet
        };
      })
    );

    // Filter out any null values (invalid subfleets)
    return subfleetData.filter(Boolean);
  } catch (error) {
    console.error(`Error listing subfleets for airline '${airline}' and fleet '${fleet}':`, error.message);
    throw error;
  }
};



const listAllTailIDs = async (airline, fleet, subfleet) => {
  try {
    // Fetch directories for the given path
    const prefixes = await listFilesInBucket(
      process.env.S3_BUCKET_STATUS_NAME,
      `${airline}/${fleet}/${subfleet}/`,
      '/'
    );

    // Extract tail IDs by splitting the prefix and removing invalid entries
    const tailIDs = prefixes.map(prefix => prefix.split('/')[3]).filter(Boolean);

    return tailIDs;
  } catch (error) {
    console.error(`Error listing tail IDs for '${airline}/${fleet}/${subfleet}':`, error.message);
    throw error;
  }
};

const listAllFilesInTailID = async (airline, fleet, subfleet, tailID) => {
  if (!airline || !fleet || !subfleet || !tailID) {
    console.error(`Invalid parameters: airline='${airline}', fleet='${fleet}', subfleet='${subfleet}', tailID='${tailID}'`);
    return []; // Return an empty array or throw an error
  }
  try {
    const prefix = `${airline}/${fleet}/${subfleet}/${tailID}/`;
    const params = {
      Bucket: process.env.S3_BUCKET_STATUS_NAME,
      Prefix: prefix, // Specify the directory prefix for the tailID
    };

    const data = await s3.send(new ListObjectsV2Command(params));

    if (data.Contents && Array.isArray(data.Contents)) {
      return data.Contents.map(item => ({
        Key: item.Key,
        Size: item.Size,
        LastModified: item.LastModified,
      }));
    } else {
      console.log(`No files found for prefix '${prefix}'`);
      return [];
    }
  } catch (error) {
    console.error(`Error listing files for '${airline}/${fleet}/${subfleet}/${tailID}':`, error.message);
    throw error;
  }
};

module.exports = {
  s3,
  checkS3Connection,
  listFilesInBucket,
  listAllFleets,
  listAllSubfleets,
  listAllTailIDs,
  listAllAirlines,
  getProgressData,
  listAllFilesInTailID,
};
