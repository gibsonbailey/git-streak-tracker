#! /bin/bash

[[ ! -d psycopg2 ]] && tar -xzf psycopg2.python39.tar.gz && echo "Extracted psycopg2.python39.tar.gz into psycopg2 directory."

zip -r my-deployment-package.zip psycopg2
zip my-deployment-package.zip lambda_function.py
aws lambda update-function-code --function-name count_git_streak_tracker_views_per_username --zip-file fileb://my-deployment-package.zip --region us-east-1
