FROM node:24-alpine AS base

WORKDIR /app

COPY . .

RUN npm install --production

RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist /usr/src/app/dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
