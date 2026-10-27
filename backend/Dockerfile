
FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ARG DATABASE_URL="postgresql://postgres:140904@localhost:5432/auth_db"

RUN DATABASE_URL="$DATABASE_URL" bun run generate

EXPOSE 3000

CMD ["bun", "run", "src/bootstrap.ts"]
