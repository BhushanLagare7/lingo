import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

import "dotenv/config";

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Resetting the database");

    console.log("Deleting all courses...");
    await db.delete(schema.courses);
    console.log("Deleting all user progress...");
    await db.delete(schema.userProgress);
    console.log("Deleting all units...");
    await db.delete(schema.units);
    console.log("Deleting all lessons...");
    await db.delete(schema.lessons);
    console.log("Deleting all challenges...");
    await db.delete(schema.challenges);
    console.log("Deleting all challenge options...");
    await db.delete(schema.challengeOptions);
    console.log("Deleting all challenge progress...");
    await db.delete(schema.challengeProgress);
    console.log("Deleting all user subscriptions...");
    await db.delete(schema.userSubscription);

    console.log("Resetting finished");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to reset the database");
  }
};

main();
