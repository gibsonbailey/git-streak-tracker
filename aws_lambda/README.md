# AWS Lambda
We use AWS Lambda to count views of our cloudfront distribution.


Cloudfront is configured to periodically gzip a log file that contains many requests and push it to a dedicated S3 bucket. This function will be triggered whenever an object is created in our logging bucket. The function will then aggregate the data and make one query to our postgres database to UPSERT the new data.

The web server is configured to read view counts (per GitHub username) from the same database.


## Building
When we update the lambda function code on AWS, we need to do it by sending a zip file. This is because we have python dependencies.

The `psycopg2` directory comes from [this repo](https://github.com/jkehler/awslambda-psycopg2). It gets zipped up as a dependency.

#### Prerequisites:
* Install and configure the aws cli.

#### Building and deploying
* In the `aws_lambda` directory, run the `build.sh` script.
