FROM node:22-slim AS base
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS deps
WORKDIR /app

# Copy workspace config and lockfile
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy all package.json files to resolve workspace dependencies
COPY apps/api/package.json apps/api/
COPY packages/shared-types/package.json packages/shared-types/
COPY packages/shared-logic/package.json packages/shared-logic/
COPY packages/api-client/package.json packages/api-client/
COPY packages/config/package.json packages/config/

RUN pnpm install --frozen-lockfile

FROM base AS runner
WORKDIR /app

COPY --from=deps /app/ ./

# Copy source code
COPY packages/shared-types/ packages/shared-types/
COPY packages/shared-logic/ packages/shared-logic/
COPY packages/api-client/ packages/api-client/
COPY packages/config/ packages/config/
COPY apps/api/ apps/api/

# Generate Prisma client for Linux
RUN pnpm --filter @eiko/api exec prisma generate

WORKDIR /app/apps/api
EXPOSE 3001
ENV NODE_ENV=production

CMD ["npx", "tsx", "src/index.ts"]
