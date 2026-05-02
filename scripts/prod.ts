import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

import "dotenv/config";

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    // Delete all existing data
    console.log("Deleting all existing data");
    await Promise.all([
      db.delete(schema.userProgress),
      db.delete(schema.challenges),
      db.delete(schema.units),
      db.delete(schema.lessons),
      db.delete(schema.courses),
      db.delete(schema.challengeOptions),
      db.delete(schema.userSubscription),
    ]);

    // Insert courses
    console.log("Inserting courses");
    const courses = await db
      .insert(schema.courses)
      .values([{ title: "Spanish", imageSrc: "/es.svg" }])
      .returning();

    // For each course, insert units
    for (const course of courses) {
      console.log("Inserting units for course", course.title);
      const units = await db
        .insert(schema.units)
        .values([
          {
            courseId: course.id,
            title: "Unit 1",
            description: `Learn the basics of ${course.title}`,
            order: 1,
          },
          {
            courseId: course.id,
            title: "Unit 2",
            description: `Learn intermediate ${course.title}`,
            order: 2,
          },
        ])
        .returning();

      // For each unit, insert lessons
      for (const unit of units) {
        console.log("Inserting lessons for unit", unit.title);
        const lessons = await db
          .insert(schema.lessons)
          .values([
            { unitId: unit.id, title: "Nouns", order: 1 },
            { unitId: unit.id, title: "Verbs", order: 2 },
            { unitId: unit.id, title: "Adjectives", order: 3 },
            { unitId: unit.id, title: "Phrases", order: 4 },
            { unitId: unit.id, title: "Sentences", order: 5 },
          ])
          .returning();

        // For each lesson, insert challenges
        for (const lesson of lessons) {
          console.log("Inserting challenges for lesson", lesson.title);
          const challenges = await db
            .insert(schema.challenges)
            .values([
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the man"?',
                order: 1,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the woman"?',
                order: 2,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the boy"?',
                order: 3,
              },
              {
                lessonId: lesson.id,
                type: "ASSIST",
                question: '"the man"',
                order: 4,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the zombie"?',
                order: 5,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the robot"?',
                order: 6,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Which one of these is "the girl"?',
                order: 7,
              },
              {
                lessonId: lesson.id,
                type: "ASSIST",
                question: '"the zombie"',
                order: 8,
              },
            ])
            .returning();

          // For each challenge, insert challenge options
          for (const challenge of challenges) {
            console.log(
              "Inserting challenge options for challenge",
              challenge.id,
            );
            if (challenge.order === 1) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "el hombre",
                  imageSrc: "/man.svg",
                  audioSrc: "/es_man.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "la mujer",
                  imageSrc: "/woman.svg",
                  audioSrc: "/es_woman.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "el chico",
                  imageSrc: "/boy.svg",
                  audioSrc: "/es_boy.mp3",
                },
              ]);
            }

            if (challenge.order === 2) {
              console.log("Inserting challenge options for challenge 2");
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "la mujer",
                  imageSrc: "/woman.svg",
                  audioSrc: "/es_woman.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "el chico",
                  imageSrc: "/boy.svg",
                  audioSrc: "/es_boy.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "el hombre",
                  imageSrc: "/man.svg",
                  audioSrc: "/es_man.mp3",
                },
              ]);
            }

            if (challenge.order === 3) {
              console.log("Inserting challenge options for challenge 3");
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "la mujer",
                  imageSrc: "/woman.svg",
                  audioSrc: "/es_woman.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "el hombre",
                  imageSrc: "/man.svg",
                  audioSrc: "/es_man.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "el chico",
                  imageSrc: "/boy.svg",
                  audioSrc: "/es_boy.mp3",
                },
              ]);
            }

            if (challenge.order === 4) {
              console.log("Inserting challenge options for challenge 4");
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "la mujer",
                  audioSrc: "/es_woman.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "el hombre",
                  audioSrc: "/es_man.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "el chico",
                  audioSrc: "/es_boy.mp3",
                },
              ]);
            }

            if (challenge.order === 5) {
              console.log("Inserting challenge options for challenge 5");
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "el hombre",
                  imageSrc: "/man.svg",
                  audioSrc: "/es_man.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "la mujer",
                  imageSrc: "/woman.svg",
                  audioSrc: "/es_woman.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "el zombie",
                  imageSrc: "/zombie.svg",
                  audioSrc: "/es_zombie.mp3",
                },
              ]);
            }

            if (challenge.order === 6) {
              console.log("Inserting challenge options for challenge 6");
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "el robot",
                  imageSrc: "/robot.svg",
                  audioSrc: "/es_robot.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "el zombie",
                  imageSrc: "/zombie.svg",
                  audioSrc: "/es_zombie.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "el chico",
                  imageSrc: "/boy.svg",
                  audioSrc: "/es_boy.mp3",
                },
              ]);
            }

            if (challenge.order === 7) {
              console.log("Inserting challenge options for challenge 7");
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "la nina",
                  imageSrc: "/girl.svg",
                  audioSrc: "/es_girl.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "el zombie",
                  imageSrc: "/zombie.svg",
                  audioSrc: "/es_zombie.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "el hombre",
                  imageSrc: "/man.svg",
                  audioSrc: "/es_man.mp3",
                },
              ]);
            }

            if (challenge.order === 8) {
              console.log("Inserting challenge options for challenge 8");
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "la mujer",
                  audioSrc: "/es_woman.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "el zombie",
                  audioSrc: "/es_zombie.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "el chico",
                  audioSrc: "/es_boy.mp3",
                },
              ]);
            }
          }
        }
      }
    }
    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

main();
