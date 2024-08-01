FROM node:18 
WORKDIR /app
COPY package.json .
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine 

COPY nginx.conf /etc/nginx/conf.d/default.conf 

COPY --from=build /app/build /usr/share/nginx/html  

EXPOSE 80  //port 개방 

CMD ["nginx", "-g", "daemon off;"]