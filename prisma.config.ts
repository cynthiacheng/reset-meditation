import { defineConfig } from "prisma/config";

// Next.js loads .env.local itself, but the Prisma CLI (generate/migrate) only
// reads .env by default — load .env.local explicitly so both share one file.
try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local yet (e.g. fresh checkout) — fine, env vars may come from elsewhere.
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // `prisma generate` doesn't connect, so don't fail builds when the var is absent.
    url: process.env.DATABASE_URL ?? "postgresql://unset:unset@localhost:5432/unset",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
