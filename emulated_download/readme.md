<pre><code>Date: Nov 5, 2024 
<br />by IdeaNova Technologies, Inc.
</code></pre>



### Emulated Demo

#### General
* This demo updates the status on AWS without actually downloading the content.
* It is currently set to take 2 minutes, "downloading" around 4% of each file every 5 seconds.
  * This can be configured by changing the global fields at the top of the file


#### CLI
* Install dependencies
  * `pip install -r requirements.txt`
* Run demo
  * `python emulate_demo.py run`
  * Will start downloading from whatever the current progress is in AWS
  * Creates campaign prefix `20240926` if it doesn't exist.
* Reset demo
  * `python emulate_demo.py reset`
  * Will delete the campaign prefix `20240926` and all `.progress` files within it.