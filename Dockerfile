FROM node:18-alpine AS base
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY .next ./.next
COPY public ./public
COPY prisma ./prisma

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production

CMD ["sh", "-c", "npx prisma migrate deploy && node .next/standalone/server.js"]
