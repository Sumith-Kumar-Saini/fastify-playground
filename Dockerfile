# ---- Base ----
FROM node:22-alpine AS base
ENV HUSKY=0
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS deps
RUN npm ci

# ---- Build ----
FROM base AS build
COPY . .
RUN npm run build

# ---- Prune prod deps ----
FROM deps AS prod-deps
RUN npm prune --omit=dev

# ---- Final Production Image ----
FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD [ "node", "dist/server.js" ]
