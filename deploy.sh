#!/bin/bash
cd /home/ubuntu/go-saudi-be
docker-compose down
git pull origin develop --no-commit
docker rmi 639040537604.dkr.ecr.ap-south-1.amazonaws.com/go-saudi-be:latest
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 639040537604.dkr.ecr.ap-south-1.amazonaws.com
docker login -u AWS -p $(aws ecr get-login-password --region ap-south-1) 639040537604.dkr.ecr.ap-south-1.amazonaws.com
docker pull 639040537604.dkr.ecr.ap-south-1.amazonaws.com/go-saudi-be:latest
docker-compose up -d --build
sudo systemctl restart nginx
docker system prune -a -f


