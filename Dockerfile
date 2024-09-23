FROM node:18.16.1-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build
EXPOSE 1337
CMD ["npm", "start"]

