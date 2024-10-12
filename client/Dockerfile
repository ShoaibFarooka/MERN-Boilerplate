# Stage 1: Build the React app
FROM node:20 AS build

WORKDIR /app/client

# Set the build argument
ARG VITE_BASE_URL

# Pass the argument to the environment variable
ENV VITE_BASE_URL=${VITE_BASE_URL}

COPY client/package.json client/package-lock.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# Stage 2: Serve the app with NGINX
FROM nginx:alpine

COPY --from=build /app/client/dist /usr/share/nginx/html
COPY ../../nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
