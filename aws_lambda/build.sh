#! /bin/bash
zip -r my-deployment-package.zip psycopg2
zip -g my-deployment-package.zip lambda_function.py
aws lambda update-function-code --function-name count_git_streak_tracker_views_per_username --zip-file fileb://my-deployment-package.zip --region us-east-1
