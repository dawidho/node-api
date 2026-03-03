# Prosty Dockerfile dla Auth Service
FROM node:20-alpine

WORKDIR /app

# Kopiuj package.json
COPY package*.json ./

# Instaluj zależności
RUN npm install

# Kopiuj cały kod
COPY . .

# Generuj Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3001

# Uruchom synchronizację schematu (bez migracji) i start
CMD npx prisma db push --accept-data-loss && npm start
