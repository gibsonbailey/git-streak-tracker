#! /bin/bash
zip -r my-deployment-package.zip venv/lib/python3.10/site-packages/
zip -g my-deployment-package.zip lambda_function.py
aws lambda update-function-code --function-name count_git_streak_tracker_views_per_username --zip-file fileb://my-deployment-package.zip --region us-east-1
