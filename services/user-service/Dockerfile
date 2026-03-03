
FROM node:20-alpine

WORKDIR ./

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3002

CMD npx prisma db push --accept-data-loss && npm start
