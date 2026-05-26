FROM node:24-alpine AS base

RUN corepack enable

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS builder

COPY . .
RUN pnpm build

FROM node:24-alpine AS runner

RUN corepack enable

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/.output ./output

EXPOSE 3000

CMD ["node", "output/server/index.mjs"]
