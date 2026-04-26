import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL environment variable");
}

const sql = neon(connectionString);
const db = drizzle({ client: sql, schema });

const main = async () => {
  try {
    console.log("Seeding database...");

    console.log("Deleting all courses...");
    await db.delete(schema.courses);

    console.log("Deleting all user progress...");
    await db.delete(schema.userProgress);

    console.log("Inserting courses...");
    await db.insert(schema.courses).values([
      {
        id: 1,
        title: "Spanish",
        imageSrc: "/es.svg",
      },
      {
        id: 2,
        title: "French",
        imageSrc: "/fr.svg",
      },
      {
        id: 3,
        title: "Italian",
        imageSrc: "/it.svg",
      },
      {
        id: 4,
        title: "Japanese",
        imageSrc: "/jp.svg",
      },
      {
        id: 5,
        title: "Croatian",
        imageSrc: "/hr.svg",
      },
    ]);

    console.log("Seeding complete ✅");
  } catch (error) {
    console.log("Error seeding database: ❌", error);
    throw error;
  }
};

main();
