/**
 * @module queries
 * @description Provides cached database query functions for managing user progress,
 * courses, lessons, and challenge tracking in a language learning application.
 * All functions utilize React's cache() for optimized data fetching and
 * automatic request deduplication.
 *
 * @requires react - For cache() function
 * @requires drizzle-orm - For database query operations
 * @requires @clerk/nextjs/server - For authentication
 * @requires @/db/drizzle - Database instance
 * @requires @/db/schema - Database schema definitions
 */
import { cache } from "react";

import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import db from "@/db/drizzle";
import {
  challengeProgress,
  courses,
  lessons,
  units,
  userProgress,
} from "@/db/schema";

/**
 * Retrieves the current authenticated user's progress data.
 *
 * @function getUserProgress
 * @async
 * @cached - Results are cached using React's cache() function
 *
 * @returns {Promise<UserProgress | null>} Returns the user's progress object including
 * their active course details, or null if:
 * - The user is not authenticated
 * - No progress record exists for the user
 *
 * @example
 * // Basic usage in a Server Component
 * const userProgress = await getUserProgress();
 * if (userProgress) {
 *   console.log(userProgress.activeCourse); // Current active course details
 *   console.log(userProgress.points);       // User's total points
 * }
 *
 * @typedef {Object} UserProgress
 * @property {string} userId - The unique identifier of the user
 * @property {Course} activeCourse - The currently active course object
 * @property {number} activeCourseId - ID of the active course
 * @property {number} points - User's total accumulated points
 * @property {number} hearts - User's remaining hearts/lives
 */
export const getUserProgress = cache(async () => {
  // Extract userId from the authenticated session
  const { userId } = await auth();

  // Return null for unauthenticated users
  if (!userId) {
    return null;
  }

  // Query the database for user's progress, including their active course details
  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true, // Eager load the active course relationship
    },
  });

  return data;
});

/**
 * Retrieves all units for the user's active course with completion status.
 *
 * @function getUnits
 * @async
 * @cached - Results are cached using React's cache() function
 *
 * @returns {Promise<NormalizedUnit[]>} Returns an array of units with their lessons
 * and completion status, or an empty array if:
 * - The user is not authenticated
 * - The user has no active course
 *
 * Data is ordered by:
 * - Units: ascending order
 * - Lessons: ascending order within each unit
 * - Challenges: ascending order within each lesson
 *
 * @example
 * const units = await getUnits();
 * units.forEach(unit => {
 *   console.log(unit.title);
 *   unit.lessons.forEach(lesson => {
 *     console.log(lesson.title, lesson.completed); // Shows completion status
 *   });
 * });
 *
 * @typedef {Object} NormalizedUnit
 * @property {number} id - Unit identifier
 * @property {string} title - Unit title
 * @property {string} description - Unit description
 * @property {number} order - Display order
 * @property {NormalizedLesson[]} lessons - Array of lessons with completion status
 *
 * @typedef {Object} NormalizedLesson
 * @property {number} id - Lesson identifier
 * @property {string} title - Lesson title
 * @property {number} order - Display order
 * @property {boolean} completed - True if all challenges are completed
 * @property {Challenge[]} challenges - Array of lesson challenges
 */
export const getUnits = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  // Return empty array if user is not authenticated or has no active course
  if (!userId || !userProgress?.activeCourseId) {
    return [];
  }

  // Fetch units with nested lessons, challenges, and progress data
  const data = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          challenges: {
            orderBy: (challenges, { asc }) => [asc(challenges.order)],
            with: {
              // Only fetch challenge progress for the current user
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  /**
   * Normalize the data by calculating completion status for each lesson.
   * A lesson is considered completed when ALL of its challenges are completed.
   *
   * Completion criteria for a challenge:
   * 1. Must have challenge progress records
   * 2. Must have at least one progress record
   * 3. Every progress record must be marked as completed
   */
  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      // Lessons with no challenges are automatically marked as incomplete
      if (lesson.challenges.length === 0) {
        return { ...lesson, completed: false };
      }

      // Check if every challenge in the lesson has been completed
      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every((progress) => progress.completed)
        );
      });

      return { ...lesson, completed: allCompletedChallenges };
    });

    return { ...unit, lessons: lessonsWithCompletedStatus };
  });

  return normalizedData;
});

/**
 * Retrieves all available courses from the database.
 *
 * @function getCourses
 * @async
 * @cached - Results are cached using React's cache() function
 *
 * @returns {Promise<Course[]>} Returns an array of all available courses.
 * Returns an empty array if no courses exist in the database.
 *
 * @example
 * const courses = await getCourses();
 * courses.forEach(course => {
 *   console.log(course.title);    // Course title
 *   console.log(course.imageSrc); // Course image path
 * });
 *
 * @typedef {Object} Course
 * @property {number} id - Course identifier
 * @property {string} title - Course title
 * @property {string} imageSrc - Path to course image
 */
export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();

  return data;
});

/**
 * Retrieves detailed information about a specific course including its
 * units and lessons in ordered sequence.
 *
 * @function getCourseById
 * @async
 * @cached - Results are cached using React's cache() function
 *
 * @param {number} courseId - The unique identifier of the course to retrieve
 *
 * @returns {Promise<CourseWithUnits | null>} Returns the course object with
 * nested units and lessons, or null if the course doesn't exist.
 *
 * Data is ordered by:
 * - Units: ascending order
 * - Lessons: ascending order within each unit
 *
 * @example
 * const course = await getCourseById(1);
 * if (course) {
 *   console.log(course.title);
 *   course.units.forEach(unit => {
 *     unit.lessons.forEach(lesson => {
 *       console.log(lesson.title);
 *     });
 *   });
 * }
 *
 * @typedef {Object} CourseWithUnits
 * @property {number} id - Course identifier
 * @property {string} title - Course title
 * @property {string} imageSrc - Path to course image
 * @property {UnitWithLessons[]} units - Ordered array of units
 *
 * @typedef {Object} UnitWithLessons
 * @property {number} id - Unit identifier
 * @property {string} title - Unit title
 * @property {number} order - Display order
 * @property {Lesson[]} lessons - Ordered array of lessons
 */
export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)],
          },
        },
      },
    },
  });

  return data;
});

/**
 * Retrieves the user's current progress within their active course.
 * Determines the first lesson that still has incomplete challenges.
 *
 * @function getCourseProgress
 * @async
 * @cached - Results are cached using React's cache() function
 *
 * @returns {Promise<CourseProgress | null>} Returns an object containing the active
 * lesson information, or null if:
 * - The user is not authenticated
 * - The user has no active course
 *
 * @example
 * const progress = await getCourseProgress();
 * if (progress?.activeLesson) {
 *   console.log(progress.activeLesson.title);  // Current lesson title
 *   console.log(progress.activeLessonId);       // Current lesson ID
 * }
 *
 * @typedef {Object} CourseProgress
 * @property {Lesson | undefined} activeLesson - The first lesson with incomplete
 *   challenges, undefined if all lessons are complete
 * @property {number | undefined} activeLessonId - ID of the active lesson,
 *   undefined if all lessons are complete
 */
export const getCourseProgress = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  // Return null if user is not authenticated or has no active course
  if (!userId || !userProgress?.activeCourseId) {
    return null;
  }

  // Fetch all units in the active course with their lessons and challenge progress
  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          unit: true, // Include parent unit reference
          challenges: {
            with: {
              // Only fetch progress for the current user
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  /**
   * Find the first lesson that has at least one incomplete challenge.
   * A challenge is considered incomplete if:
   * 1. It has no progress records, OR
   * 2. It has an empty progress array, OR
   * 3. Any progress record is marked as not completed
   */
  const firstUncompletedLesson = unitsInActiveCourse
    .flatMap((unit) => unit.lessons) // Flatten all lessons across units
    .find((lesson) => {
      return lesson.challenges.some((challenge) => {
        return (
          !challenge.challengeProgress ||
          challenge.challengeProgress.length === 0 ||
          challenge.challengeProgress.some(
            (progress) => progress.completed === false,
          )
        );
      });
    });

  return {
    activeLesson: firstUncompletedLesson,
    activeLessonId: firstUncompletedLesson?.id,
  };
});

/**
 * Retrieves detailed information about a specific lesson including all challenges
 * with their options and completion status.
 *
 * @function getLesson
 * @async
 * @cached - Results are cached using React's cache() function
 *
 * @param {number} [id] - Optional lesson ID. If not provided, uses the current
 * active lesson ID from the user's course progress.
 *
 * @returns {Promise<NormalizedLesson | null>} Returns the lesson with normalized
 * challenge data, or null if:
 * - The user is not authenticated
 * - No lesson ID is provided or found in progress
 * - The lesson doesn't exist in the database
 * - The lesson has no challenges
 *
 * @example
 * // Get specific lesson
 * const lesson = await getLesson(42);
 *
 * // Get current active lesson
 * const activeLesson = await getLesson();
 *
 * if (lesson) {
 *   lesson.challenges.forEach(challenge => {
 *     console.log(challenge.question);  // Challenge question
 *     console.log(challenge.completed); // Whether challenge is completed
 *     console.log(challenge.challengeOptions); // Available answer options
 *   });
 * }
 *
 * @typedef {Object} NormalizedChallenge
 * @property {number} id - Challenge identifier
 * @property {string} question - Challenge question text
 * @property {string} type - Type of challenge (e.g., 'SELECT', 'ASSIST')
 * @property {boolean} completed - Whether the challenge has been completed
 * @property {ChallengeOption[]} challengeOptions - Available answer options
 * @property {ChallengeProgress[]} challengeProgress - User's progress records
 */
export const getLesson = cache(async (id?: number) => {
  const { userId } = await auth();

  // Return null for unauthenticated users
  if (!userId) {
    return null;
  }

  const courseProgress = await getCourseProgress();

  // Use provided ID or fall back to the active lesson ID from course progress
  const lessonId = id || courseProgress?.activeLessonId;

  // Return null if no valid lesson ID is available
  if (!lessonId) {
    return null;
  }

  // Fetch lesson with challenges, options, and user's progress
  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true, // All possible answer options
          challengeProgress: {
            where: eq(challengeProgress.userId, userId), // Only user's progress
          },
        },
      },
    },
  });

  // Validate that the lesson and its challenges exist
  if (!data || !data.challenges) {
    return null;
  }

  /**
   * Normalize challenges by adding a computed 'completed' field.
   * A challenge is completed when:
   * 1. It has at least one progress record
   * 2. ALL progress records are marked as completed
   */
  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed =
      challenge.challengeProgress &&
      challenge.challengeProgress.length > 0 &&
      challenge.challengeProgress.every((progress) => progress.completed);

    return { ...challenge, completed };
  });

  return { ...data, challenges: normalizedChallenges };
});

/**
 * Calculates the completion percentage of the user's current active lesson.
 *
 * @function getLessonPercentage
 * @async
 * @cached - Results are cached using React's cache() function
 *
 * @returns {Promise<number>} Returns a rounded percentage (0-100) representing
 * the proportion of completed challenges in the active lesson.
 * Returns 0 if:
 * - There is no active lesson
 * - The lesson cannot be found
 *
 * @example
 * const percentage = await getLessonPercentage();
 * console.log(`${percentage}% of the lesson is complete`);
 * // Example: "75% of the lesson is complete"
 *
 * @calculation
 * percentage = Math.round((completedChallenges / totalChallenges) * 100)
 */
export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress();

  // Return 0 if there's no active lesson
  if (!courseProgress?.activeLessonId) {
    return 0;
  }

  const lesson = await getLesson(courseProgress.activeLessonId);

  // Return 0 if the lesson couldn't be retrieved
  if (!lesson) {
    return 0;
  }

  // Calculate the percentage of completed challenges
  const completedChallenges = lesson.challenges.filter(
    (challenge) => challenge.completed,
  );
  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100,
  );

  return percentage;
});

/**
 * Retrieves the top 10 users ranked by their accumulated points.
 * Used for displaying the application's leaderboard.
 *
 * @function getTopTenUsers
 * @async
 * @cached - Results are cached using React's cache() function
 *
 * @returns {Promise<LeaderboardUser[]>} Returns an array of up to 10 users
 * sorted by points in descending order, or an empty array if:
 * - The current user is not authenticated
 *
 * @example
 * const topUsers = await getTopTenUsers();
 * topUsers.forEach((user, index) => {
 *   console.log(`${index + 1}. ${user.userName}: ${user.points} points`);
 * });
 * // Example output:
 * // 1. JohnDoe: 1500 points
 * // 2. JaneSmith: 1200 points
 *
 * @typedef {Object} LeaderboardUser
 * @property {string} userId - User's unique identifier
 * @property {string} userName - User's display name
 * @property {string} userImageSrc - URL to user's profile image
 * @property {number} points - User's total accumulated points
 *
 * @note Only returns a subset of user fields (userId, userName, userImageSrc, points)
 * for privacy and performance reasons
 */
export const getTopTenUsers = cache(async () => {
  const { userId } = await auth();

  // Return empty array for unauthenticated users
  if (!userId) {
    return [];
  }

  // Fetch top 10 users ordered by points descending
  const data = await db.query.userProgress.findMany({
    orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
    limit: 10,
    // Select only necessary fields for the leaderboard display
    columns: {
      userId: true,
      userName: true,
      userImageSrc: true,
      points: true,
    },
  });

  return data;
});
