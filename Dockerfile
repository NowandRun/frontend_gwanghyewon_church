# Stage 1: Build
FROM node:22 AS build
RUN mkdir -p /app
WORKDIR /app

# package.json 및 package-lock.json 먼저 복사하고 종속성 설치
COPY package*.json /app
RUN npm install

# 소스 파일을 복사하고 빌드
COPY . /app
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
EXPOSE 3000
COPY ./conf/default.conf /etc/nginx/conf.d/default.conf 
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 설정 파일 복사
# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]