FROM nginx:latest

WORKDIR /app
COPY . .

EXPOSE 81

ENTRYPOINT ["nginx", "-g", "daemon off;"]
