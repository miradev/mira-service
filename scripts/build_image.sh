#!/bin/bash

docker kill mira
docker rm mira
docker image build -t mira_service .
docker container run --publish 80:8000 --detach --name mira mira_service:latest
