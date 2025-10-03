FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

CMD ["pnpm", "dev"]
