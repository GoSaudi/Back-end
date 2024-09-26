#!/bin/bash
git pull 
# export IMAGE_TAG=$(git rev-parse --short HEAD)
# echo $IMAGE_TAG
docker ps
docker-compose down
docker system prune -a -f
docker-compose up -d --build
clear
docker ps
