FROM node:22 AS build
WORKDIR /app
COPY package.json .
COPY . .
RUN npm install
RUN npm run build
