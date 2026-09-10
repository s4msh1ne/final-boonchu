import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const postgresUrl = new URL(process.env.POSTGRES_URL!);
postgresUrl.searchParams.set("sslmode", "verify-full");

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: postgresUrl.toString(),
  },
});
