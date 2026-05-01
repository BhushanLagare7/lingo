/**
 * @file drizzle.config.ts
 * @description Drizzle ORM configuration for database migrations and schema management.
 * Configures database connection and schema paths for Drizzle ORM CLI commands.
 */

import { defineConfig } from "drizzle-kit";

import "dotenv/config";

/**
 * Database connection string from environment variable
 * @type {string}
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL environment variable");
}

/**
 * Drizzle ORM configuration object
 * @type {import('drizzle-kit').defineConfig}
 */
export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
