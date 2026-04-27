/**
 * @module schema
 * @description Database schema definitions for a language learning application (Lingo).
 *
 * @requires drizzle-orm - Core ORM functionality for defining table relationships
 * @requires drizzle-orm/pg-core - PostgreSQL-specific column types and table definitions
 *
 * Imported column types:
 * - {@link boolean}   - For true/false flags (e.g., correct answers, completion status)
 * - {@link integer}   - For numeric values and foreign key references
 * - {@link pgEnum}    - For PostgreSQL native enum types
 * - {@link pgTable}   - For defining PostgreSQL table structures
 * - {@link serial}    - For auto-incrementing primary keys
 * - {@link text}      - For variable-length string data
 * - {@link timestamp} - For date/time values (e.g., subscription periods)
 */
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * @table courses
 * @description Represents the top-level learning courses available in the application.
 * Each course is a complete language or subject program (e.g., "Spanish", "French").
 *
 * @column {serial}  id       - Auto-incrementing unique identifier. Serves as the primary key.
 * @column {text}    title    - The display name of the course (e.g., "Spanish"). Cannot be null.
 * @column {text}    imageSrc - URL or path to the course's thumbnail/banner image. Cannot be null.
 *
 * @example
 * // Example record
 * { id: 1, title: "Spanish", imageSrc: "/images/spanish.svg" }
 */
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
});

/**
 * @relation coursesRelations
 * @description Defines the one-to-many relationships originating from the courses table.
 *
 * @relationship {many} userProgress - A course can be actively followed by many users.
 *                                     Links to {@link userProgress} via `activeCourseId`.
 * @relationship {many} units        - A course is composed of many ordered units.
 *                                     Links to {@link units} via `courseId`.
 */
export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  units: many(units),
}));

/**
 * @table units
 * @description Represents a thematic section or chapter within a course.
 * Units group related lessons together in a sequential order
 * (e.g., "Unit 1: Basics", "Unit 2: Greetings").
 *
 * @column {serial}   id          - Auto-incrementing unique identifier. Serves as the primary key.
 * @column {text}     title       - The display name of the unit (e.g., "Unit 1"). Cannot be null.
 * @column {text}     description - A brief summary of what the unit covers
 *                                  (e.g., "Learn the basics of Spanish"). Cannot be null.
 * @column {integer}  courseId    - Foreign key referencing the parent {@link courses} record.
 *                                  Cascades deletes: removing a course removes all its units. Cannot be null.
 * @column {integer}  order       - Numeric value determining the display sequence within the course.
 *                                  Lower values appear first. Cannot be null.
 *
 * @example
 * // Example record
 * { id: 1, title: "Unit 1", description: "Learn the basics of Spanish", courseId: 1, order: 1 }
 */
export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  courseId: integer("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull(),
});

/**
 * @relation unitsRelations
 * @description Defines both the parent and child relationships for the units table.
 *
 * @relationship {one}  course  - Each unit belongs to exactly one parent course.
 *                                Joined on `units.courseId` → `courses.id`.
 * @relationship {many} lessons - A unit contains many ordered lessons.
 *                                Links to {@link lessons} via `unitId`.
 */
export const unitsRelations = relations(units, ({ many, one }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

/**
 * @table lessons
 * @description Represents an individual learning session within a unit.
 * Each lesson contains a collection of challenges/exercises that the user must complete.
 *
 * @column {serial}  id     - Auto-incrementing unique identifier. Serves as the primary key.
 * @column {text}    title  - The display name of the lesson (e.g., "Introduction"). Cannot be null.
 * @column {integer} unitId - Foreign key referencing the parent {@link units} record.
 *                            Cascades deletes: removing a unit removes all its lessons. Cannot be null.
 * @column {integer} order  - Numeric value determining the display sequence within the unit.
 *                            Lower values appear first. Cannot be null.
 *
 * @example
 * // Example record
 * { id: 1, title: "Introduction", unitId: 1, order: 1 }
 */
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  unitId: integer("unit_id")
    .references(() => units.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull(),
});

/**
 * @relation lessonsRelations
 * @description Defines both the parent and child relationships for the lessons table.
 *
 * @relationship {one}  unit       - Each lesson belongs to exactly one parent unit.
 *                                   Joined on `lessons.unitId` → `units.id`.
 * @relationship {many} challenges - A lesson contains many challenges (questions/exercises).
 *                                   Links to {@link challenges} via `lessonId`.
 */
export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}));

/**
 * @enum challengesEnum
 * @description PostgreSQL native enum defining the supported challenge (question) types.
 *
 * @value {"SELECT"} SELECT - A multiple-choice question where users select the correct answer
 *                            from a list of provided options.
 * @value {"ASSIST"}  ASSIST - An assisted question type, typically used for guided exercises
 *                             or fill-in-the-blank style interactions.
 */
export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]);

/**
 * @table challenges
 * @description Represents an individual question or exercise within a lesson.
 * Challenges are the core interactive elements users engage with during a lesson.
 *
 * @column {serial}         id       - Auto-incrementing unique identifier. Serves as the primary key.
 * @column {integer}        lessonId - Foreign key referencing the parent {@link lessons} record.
 *                                     Cascades deletes: removing a lesson removes all its challenges.
 *                                     Cannot be null.
 * @column {challengesEnum} type     - The type of challenge, constrained to values defined in
 *                                     {@link challengesEnum} ("SELECT" or "ASSIST"). Cannot be null.
 * @column {text}           question - The prompt or question text displayed to the user
 *                                     (e.g., 'Which of these means "Hello"?'). Cannot be null.
 * @column {integer}        order    - Numeric value determining the display sequence within the lesson.
 *                                     Lower values appear first. Cannot be null.
 *
 * @example
 * // Example record
 * { id: 1, lessonId: 1, type: "SELECT", question: 'Which means "Hello"?', order: 1 }
 */
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, { onDelete: "cascade" })
    .notNull(),
  type: challengesEnum("type").notNull(),
  question: text("question").notNull(),
  order: integer("order").notNull(),
});

/**
 * @relation challengesRelations
 * @description Defines the parent and child relationships for the challenges table.
 *
 * @relationship {one}  lesson            - Each challenge belongs to exactly one parent lesson.
 *                                          Joined on `challenges.lessonId` → `lessons.id`.
 * @relationship {many} challengeOptions  - A challenge has multiple answer options to choose from.
 *                                          Links to {@link challengeOptions} via `challengeId`.
 * @relationship {many} challengeProgress - Tracks individual user progress for this challenge.
 *                                          Links to {@link challengeProgress} via `challengeId`.
 */
export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

/**
 * @table challengeOptions
 * @description Represents a single answer option for a challenge.
 * Each challenge has multiple options, and exactly one (or more) are marked as correct.
 * Options can include rich media (images, audio) for multimedia questions.
 *
 * @column {serial}  id          - Auto-incrementing unique identifier. Serves as the primary key.
 * @column {integer} challengeId - Foreign key referencing the parent {@link challenges} record.
 *                                 Cascades deletes: removing a challenge removes all its options.
 *                                 Cannot be null.
 * @column {text}    text        - The display text of this answer option
 *                                 (e.g., "Hello", "Goodbye"). Cannot be null.
 * @column {boolean} correct     - Indicates whether this option is the correct answer.
 *                                 `true` = correct, `false` = incorrect. Cannot be null.
 * @column {text}    imageSrc    - Optional URL or path to an image associated with this option.
 *                                 Used for visual/picture-based questions. Nullable.
 * @column {text}    audioSrc    - Optional URL or path to an audio clip associated with this option.
 *                                 Used for listening-based questions. Nullable.
 *
 * @example
 * // Example records for a single challenge
 * { id: 1, challengeId: 1, text: "Hello", correct: true,  imageSrc: null, audioSrc: "/audio/hello.mp3" }
 * { id: 2, challengeId: 1, text: "Bye",   correct: false, imageSrc: null, audioSrc: "/audio/bye.mp3"   }
 */
export const challengeOptions = pgTable("challenge_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
  text: text("text").notNull(),
  correct: boolean("correct").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
});

/**
 * @relation challengeOptionsRelations
 * @description Defines the parent relationship for the challengeOptions table.
 *
 * @relationship {one} challenge - Each option belongs to exactly one parent challenge.
 *                                 Joined on `challengeOptions.challengeId` → `challenges.id`.
 */
export const challengeOptionsRelations = relations(
  challengeOptions,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeOptions.challengeId],
      references: [challenges.id],
    }),
  }),
);

/**
 * @table challengeProgress
 * @description Tracks whether a specific user has completed a specific challenge.
 * Acts as a junction table between users and challenges, recording individual
 * exercise completion status for progress tracking and lesson resumption.
 *
 * @column {serial}  id          - Auto-incrementing unique identifier. Serves as the primary key.
 * @column {text}    userId      - The unique identifier of the user (sourced from the auth provider).
 *                                 Cannot be null.
 * @column {integer} challengeId - Foreign key referencing the associated {@link challenges} record.
 *                                 Cascades deletes: removing a challenge removes related progress.
 *                                 Cannot be null.
 * @column {boolean} completed   - Indicates whether the user has successfully completed the challenge.
 *                                 Defaults to `false` upon record creation. Cannot be null.
 *
 * @example
 * // Example record — user "user_abc123" has completed challenge #1
 * { id: 1, userId: "user_abc123", challengeId: 1, completed: true }
 */
export const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
  completed: boolean("completed").notNull().default(false),
});

/**
 * @relation challengeProgressRelations
 * @description Defines the parent relationship for the challengeProgress table.
 *
 * @relationship {one} challenge - Each progress record is associated with exactly one challenge.
 *                                 Joined on `challengeProgress.challengeId` → `challenges.id`.
 */
export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeProgress.challengeId],
      references: [challenges.id],
    }),
  }),
);

/**
 * @table userProgress
 * @description Stores the overall learning progress and gamification stats for each user.
 * This is the central record tracking a user's engagement with the platform,
 * including their active course, lives (hearts), and earned points.
 *
 * @column {text}    userId         - The unique identifier from the authentication provider.
 *                                    Serves as the primary key (no surrogate key needed).
 * @column {text}    userName       - The user's display name. Defaults to "User". Cannot be null.
 * @column {text}    userImageSrc   - URL or path to the user's avatar/profile image.
 *                                    Defaults to "/mascot.svg". Cannot be null.
 * @column {integer} activeCourseId - Foreign key referencing the {@link courses} record the user
 *                                    is currently enrolled in. Nullable (user may have no active course).
 *                                    Cascades deletes: if a course is deleted, this field is set appropriately.
 * @column {integer} hearts         - The number of lives/attempts remaining for the user.
 *                                    Used for the game mechanic that limits mistakes. Defaults to 5.
 *                                    Cannot be null.
 * @column {integer} points         - The total experience points (XP) the user has accumulated
 *                                    across all completed lessons. Defaults to 0. Cannot be null.
 *
 * @example
 * // Example record
 * {
 *   userId: "user_abc123",
 *   userName: "John",
 *   userImageSrc: "/avatars/john.png",
 *   activeCourseId: 2,
 *   hearts: 4,
 *   points: 350
 * }
 */
export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull().default("User"),
  userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
  activeCourseId: integer("active_course_id").references(() => courses.id, {
    onDelete: "cascade",
  }),
  hearts: integer("hearts").notNull().default(5),
  points: integer("points").notNull().default(0),
});

/**
 * @relation userProgressRelations
 * @description Defines the relationship between user progress and the active course.
 *
 * @relationship {one} activeCourse - Links the user's active course to the {@link courses} table.
 *                                    Joined on `userProgress.activeCourseId` → `courses.id`.
 *                                    Will be null if the user has not selected a course.
 */
export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}));

/**
 * @table userSubscription
 * @description Stores Stripe payment and subscription details for users who have
 * upgraded to a premium plan. This table enables the application to verify active
 * subscriptions and manage billing lifecycle events (renewals, cancellations).
 *
 * @column {serial}    id                     - Auto-incrementing unique identifier. Serves as the primary key.
 * @column {text}      userId                 - The unique identifier of the subscribed user
 *                                              (from the auth provider). Must be unique. Cannot be null.
 * @column {text}      stripeCustomerId       - The Stripe Customer ID (e.g., "cus_XXXXXXXXXX").
 *                                              Used to identify the customer in Stripe's system.
 *                                              Must be unique. Cannot be null.
 * @column {text}      stripeSubscriptionId   - The Stripe Subscription ID (e.g., "sub_XXXXXXXXXX").
 *                                              Used to manage and query the subscription in Stripe.
 *                                              Must be unique. Cannot be null.
 * @column {text}      stripePriceId          - The Stripe Price ID (e.g., "price_XXXXXXXXXX").
 *                                              Identifies which pricing plan the user is subscribed to.
 *                                              Cannot be null.
 * @column {timestamp} stripeCurrentPeriodEnd - The timestamp when the current billing period ends.
 *                                              Used to determine if a subscription is still active
 *                                              and when the next renewal occurs. Cannot be null.
 *
 * @example
 * // Example record
 * {
 *   id: 1,
 *   userId: "user_abc123",
 *   stripeCustomerId: "cus_ABC123XYZ",
 *   stripeSubscriptionId: "sub_DEF456UVW",
 *   stripePriceId: "price_GHI789RST",
 *   stripeCurrentPeriodEnd: 2024-12-31T23:59:59.000Z
 * }
 */
export const userSubscription = pgTable("user_subscription", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
});

/*
 * ER Diagram - Database Schema Relationships
 * ============================================
 *
 *                    ┌─────────────────┐
 *                    │    courses      │
 *                    │─────────────────│
 *                    │ id (PK)         │
 *                    │ title           │
 *                    │ imageSrc        │
 *                    └────────┬────────┘
 *                             │ 1
 *               ┌─────────────┴─────────────┐
 *               │ many                       │ many
 *      ┌────────▼────────┐         ┌─────────▼────────┐
 *      │     units       │         │  userProgress    │
 *      │─────────────────│         │──────────────────│
 *      │ id (PK)         │         │ userId (PK)      │
 *      │ title           │         │ userName         │
 *      │ description     │         │ userImageSrc     │
 *      │ courseId (FK)   │         │ activeCourseId   │
 *      │ order           │         │ hearts           │
 *      └────────┬────────┘         │ points           │
 *               │ 1                └──────────────────┘
 *               │ many
 *      ┌─────────▼───────┐
 *      │    lessons      │
 *      │─────────────────│
 *      │ id (PK)         │
 *      │ title           │
 *      │ unitId (FK)     │
 *      │ order           │
 *      └────────┬────────┘
 *               │ 1
 *               │ many
 *      ┌─────────▼───────────┐
 *      │     challenges      │
 *      │─────────────────────│
 *      │ id (PK)             │
 *      │ lessonId (FK)       │
 *      │ type (SELECT/ASSIST)│
 *      │ question            │
 *      │ order               │
 *      └───┬─────────────┬───┘
 *          │ 1           │ 1
 *    many  │             │  many
 * ┌─────────▼────┐  ┌─────▼──────────────┐
 * │challengeOpts │  │  challengeProgress │
 * │──────────────│  │────────────────────│
 * │ id (PK)      │  │ id (PK)            │
 * │ challengeId  │  │ userId             │
 * │ text         │  │ challengeId (FK)   │
 * │ correct      │  │ completed          │
 * │ imageSrc     │  └────────────────────┘
 * │ audioSrc     │
 * └──────────────┘
 *
 * userSubscription (standalone - linked to user via userId)
 */
