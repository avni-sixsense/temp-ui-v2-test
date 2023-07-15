#!/bin/bash
file_name=build/.buildInfo
if !( [ -e "${file_name}" ]); then
  echo >> "${file_name}"
fi
value=`cat .env`
echo "$value" > "${file_name}"
echo "COMMIT_ID=$(git rev-parse --verify HEAD)" >> "${file_name}"
echo "BRANCH=$(git rev-parse --abbrev-ref HEAD)" >> "${file_name}"
echo "CREATED_AT=$(date -u)" >> "${file_name}"