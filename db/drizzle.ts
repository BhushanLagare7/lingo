import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "./schema";

/**
 * @file db/drizzle.ts
 * @description Drizzle ORM database client initialization for Neon database.
 * This module sets up the database connection using Neon Serverless driver
 * and exports the Drizzle ORM instance with the complete schema.
 */

/**
 * Database connection string from environment variables
 * Required for connecting to the Neon database
 * @type {string | undefined}
 */
const connectionString = process.env.DATABASE_URL;

/**
 * Ensure database connection string is configured
 * Throws an error if DATABASE_URL is not set in the environment
 */
if (!connectionString) {
  throw new Error("Missing DATABASE_URL environment variable");
}

/**
 * Neon database connection
 * Creates a serverless PostgreSQL connection using Neon
 * @type {import('@neondatabase/serverless').NeonHttp} - Neon HTTP client instance
 */
const sql = neon(connectionString);

/**
 * Drizzle ORM database client
 * Fully configured with the complete database schema
 * @type {import("drizzle-orm").Drizzle<typeof schema, { sql: import('@neondatabase/serverless').NeonHttp }>} - Drizzle ORM instance
 * @property {object} schema - All database tables, relations, and schema objects
 * @property {import('@neondatabase/serverless').NeonHttp} client - The Neon database client instance
 *
 * @example
 * // Import the database client with the complete schema
 * import db from "./db";
 *
 * // Query users table
 * const users = await db.select().from(db.schema.users);
 *
 * // Create a new user
 * await db.insert(db.schema.users).values({
 *   name: "John Doe",
 *   email: [EMAIL_ADDRESS]",
 * });
 *
 * // Access specific table schemas
 * const { users, courses, lessons } = db.schema;
 *
 * // Use Drizzle query builder methods
 * const activeCourses = await db
 *   .select()
 *   .from(courses)
 *   .where(eq(courses.isActive, true))
 *   .limit(10);
 */
const db = drizzle({ client: sql, schema });

export default db;
