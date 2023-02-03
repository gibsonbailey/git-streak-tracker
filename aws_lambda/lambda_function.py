import os
import boto3
import tempfile
import gzip
import shutil
import csv
from collections import Counter

import psycopg2


HEADER_PREFIX = '#Fields: '


def lambda_handler(event, context):
    """
    This is triggered when an object gets created in the git-streak-tracker-logs bucket.
    """
    bucket = event['Records'][0]['s3']['bucket']['name']
    object_key = event['Records'][0]['s3']['object']['key']

    print(bucket)
    print(object_key)

    try:
        temp_dir = tempfile.TemporaryDirectory()
        filename = f'{temp_dir.name}/logs.txt'
        filename_gz = f'{filename}.gz'

        # This log file contains a tab-separated table of requests that happened on our cloudfront distribution.
        # There is a column that shows the path, which we can extract a GitHub username from. This is how we count
        # the views of each username.

        # Download the file from s3 to this local filesystem
        s3 = boto3.client('s3')
        s3.download_file(bucket, object_key, filename_gz)

        # Unzip log file
        with gzip.open(filename_gz, 'rb') as f_in:
            with open(filename, 'wb+') as f_out:
                shutil.copyfileobj(f_in, f_out)

        # Prepare file for csv.DictReader
        with open(filename, 'r') as f:
            data = f.readlines()
            data = data[1:]  # Remove first line. Does not contain data.
            # Remove prefix to the list of fields on the header line.
            data[0] = data[0].replace(HEADER_PREFIX, '').replace(' ', '\t')

        # Extract GitHub usernames and their counts from file
        with open(filename, 'w+') as f:
            f.writelines(data)
            f.seek(0)
            reader = csv.DictReader(f, delimiter='\t')
            username_counts = Counter([
                row['cs-uri-stem'][1:]
                for row in reader if row['cs-uri-stem'][1:].isalnum()
            ])
            print(username_counts)

            query = 'INSERT INTO users(username, view_count) VALUES\n'

            # Only make query if there is data
            if len(username_counts):
                for username, view_count in username_counts.items():
                    query += f"    ('{username}', {view_count}),\n"

                # Remove trailing comma from last values entry
                query = query[:-2] + '\n'

            query += 'ON CONFLICT (username) DO UPDATE SET view_count = users.view_count + EXCLUDED.view_count;'
            print('Query:')
            print(query)

            # Send new view counts to postgres using query that creates rows if they don't exist and increments rows
            # that already exist by the view count aggregated earlier.
            conn = psycopg2.connect(
                dbname=os.getenv('DB_NAME'),
                host=os.getenv('DB_HOST'),
                user=os.getenv('DB_USERNAME'),
                password=os.getenv('DB_PASSWORD'),
                port=os.getenv('DB_PORT'),
            )
            cursor = conn.cursor()
            cursor.execute(query)
            cursor.close()
            conn.commit()

            # Bulk upsert query example that works:
            #
            # INSERT INTO users (username, view_count) VALUES
            #     ('gibsonbailey', 1),
            #     ('sw00d', 3)
            # ON CONFLICT (username) DO UPDATE SET view_count = users.view_count + EXCLUDED.view_count;

    except Exception as e:
        print('Bad news! Failure!')
        print(e)
