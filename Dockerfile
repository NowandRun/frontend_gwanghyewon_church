# Stage 1: Build
FROM node:22 AS build
WORKDIR /app

# package.json 및 package-lock.json 먼저 복사하고 종속성 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 파일을 복사하고 빌드
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]