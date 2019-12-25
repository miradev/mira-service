#!/bin/bash

docker pull mongo -q
docker kill mira_dev
docker rm mira_dev
docker container run --publish 3000:27017 --detach --name mira_dev mongo:latest
