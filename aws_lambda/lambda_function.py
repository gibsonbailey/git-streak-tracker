import boto3
import tempfile
import gzip
import shutil
import csv


HEADER_PREFIX = '#Fields: '


def lambda_handler(event, context):
    bucket = event['Records'][0]['s3']['bucket']['name']
    object_key = event['Records'][0]['s3']['object']['key']

    print(bucket)
    print(object_key)

    try:
        temp_dir = tempfile.TemporaryDirectory()
        filename = f'{temp_dir.name}/logs.txt'
        filename_gz = f'{filename}.gz'

        s3 = boto3.client('s3')
        s3.download_file(bucket, object_key, filename_gz)

        # Unzip file
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
            for row in reader:
                print(row['date'], row['cs-uri-stem'])

        # Bulk upsert example that works:
        #
        # INSERT INTO users (username, view_count) VALUES
        #     ('gibsonbailey', 1),
        #     ('sw00d', 3)
        # ON CONFLICT (username) DO UPDATE SET view_count = users.view_count + EXCLUDED.view_count;

    except Exception as e:
        print('Bad news! Failure!')
        print(e)

    return {
        'statusCode': 200,
        'body': "Hello!"
    }
