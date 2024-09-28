#!/bin/bash
git pull 
docker ps
docker-compose -f docker-compose.dev.yml down
docker system prune -a -f
docker-compose -f docker-compose.dev.yml up -d --build
docker ps
docker logs go-saudi-be
docker logs mysql
