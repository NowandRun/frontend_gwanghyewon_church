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
FROM node:22-slim
WORKDIR /app

# 빌드된 파일을 복사
COPY --from=build /app/build /app/build
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json

# 애플리케이션 실행
CMD ["npm", "start"]
