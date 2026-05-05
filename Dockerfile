# ---- Build stage ----
FROM node:22-alpine AS build

WORKDIR /app

# Install deps first (layer caching)
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/server/package.json packages/server/
COPY packages/client/package.json packages/client/
RUN npm ci

# Copy source
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY packages/server packages/server
COPY packages/client packages/client

# Build all packages
RUN npm run build

# ---- Production stage ----
FROM node:22-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

# Copy root + shared + server package manifests for production install
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/server/package.json packages/server/
RUN npm ci --workspace=packages/shared --workspace=packages/server --omit=dev

# Copy built server + shared
COPY --from=build /app/packages/shared/dist packages/shared/dist
COPY --from=build /app/packages/shared/package.json packages/shared/package.json
COPY --from=build /app/packages/server/dist packages/server/dist

# Copy built client for static serving
COPY --from=build /app/packages/client/dist packages/client/dist

EXPOSE 3001

CMD ["node", "packages/server/dist/index.js"]
