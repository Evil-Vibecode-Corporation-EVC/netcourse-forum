FROM node:24-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
