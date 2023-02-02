### AWS Lambda
We use AWS Lambda to count views of our cloudfront distribution.


Cloudfront is configured to periodically gzip a log file that contains many requests and push it to a dedicated S3 bucket. This function will be triggered whenever an object is created in our logging bucket. The function will then aggregate the data and make one query to our postgres database to UPSERT the new data.

The web server is configured to read view counts (per GitHub username) from the same database.

### Building
When we update the lambda function code on AWS, we need to do it by sending a zip file. This is because we have python dependencies, e.g. psycopg.

In order to build, follow this process:
1. Make sure you've created a python virtual environment in the `aws_lambda/venv` directory.
2. Activate the environment `source venv/bin/activate` and install the dependencies `pip install -r requirements.txt`.
3. Deactivate the environment `deactivate`.
4. In the `aws_lambda` directory, run the `build.sh` script.
