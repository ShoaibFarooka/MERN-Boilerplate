FROM node:20

WORKDIR /app/server

COPY server/package.json server/package-lock.json ./
RUN npm ci

COPY server/ ./
RUN npm run build

EXPOSE 5999

CMD ["node", "dist/index.js"]