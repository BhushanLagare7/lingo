/**
 * @file user-progress.ts
 * @description Server-side actions for managing user progress in a language learning application.
 * Handles course enrollment, heart management, and points system.
 *
 * @module user-progress
 * @requires next/cache
 * @requires next/navigation
 * @requires drizzle-orm
 * @requires @clerk/nextjs/server
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { and, eq } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";

import { POINTS_TO_REFILL } from "@/constants";
import db from "@/db/drizzle";
import {
  getCourseById,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";

/**
 * Creates or updates a user's progress record for a specified course.
 *
 * @async
 * @function upsertUserProgress
 * @param {number} courseId - The unique identifier of the course to enroll in or update progress for.
 *
 * @throws {Error} Throws "Unauthorized" if the user is not authenticated.
 * @throws {Error} Throws "Course not found" if the specified course doesn't exist.
 * @throws {Error} Throws "Course is empty" if the course has no units or lessons.
 *
 * @returns {Promise<void>} Redirects to "/learn" upon successful operation.
 *
 * @example
 * // Enroll user in a course or update their active course
 * await upsertUserProgress(42);
 *
 * @sideEffects
 * - Updates or inserts a record in the userProgress table.
 * - Revalidates the cache for "/courses" and "/learn" paths.
 * - Redirects the user to the "/learn" page.
 */
export const upsertUserProgress = async (courseId: number) => {
  // Retrieve the authenticated user's ID and full user object
  const { userId } = await auth();
  const user = await currentUser();

  // Ensure the user is authenticated before proceeding
  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  // Verify the course exists in the database
  const course = await getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  // Ensure the course has at least one unit and one lesson
  if (!course.units.length || !course.units[0].lessons.length) {
    throw new Error("Course is empty");
  }

  // Check if the user already has a progress record
  const existingUserProgress = await getUserProgress();

  if (existingUserProgress) {
    // Update the existing progress record with the new active course and latest user info
    await db
      .update(userProgress)
      .set({
        activeCourseId: courseId,
        userName: user.firstName || "User", // Fallback to "User" if no first name
        userImageSrc: user.imageUrl || "/mascot.svg", // Fallback to default mascot image
      })
      .where(eq(userProgress.userId, userId));

    // Invalidate cached data for affected pages
    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
  }

  // Insert a new progress record for first-time enrollment
  await db.insert(userProgress).values({
    userId: user.id,
    activeCourseId: courseId,
    userName: user.firstName || "User", // Fallback to "User" if no first name
    userImageSrc: user.imageUrl || "/mascot.svg", // Fallback to default mascot image
  });

  // Invalidate cached data for affected pages
  revalidatePath("/courses");
  revalidatePath("/learn");
  redirect("/learn");
};

/**
 * Reduces the user's heart count by one when they answer a challenge incorrectly.
 *
 * Hearts represent lives in the application. This function handles several edge cases:
 * - Practice challenges do not reduce hearts.
 * - Active subscribers are exempt from losing hearts.
 * - Users with zero hearts cannot proceed.
 *
 * @async
 * @function reduceHearts
 * @param {number} challengeId - The unique identifier of the challenge being attempted.
 *
 * @throws {Error} Throws "Unauthorized" if the user is not authenticated.
 * @throws {Error} Throws "Challenge not found" if the specified challenge doesn't exist.
 * @throws {Error} Throws "User progress not found" if no progress record exists for the user.
 *
 * @returns {Promise<{ error: "practice" } | { error: "subscription" } | { error: "hearts" } | void>}
 *  - Returns `{ error: "practice" }` if the challenge is being retried (already completed).
 *  - Returns `{ error: "subscription" }` if the user has an active subscription.
 *  - Returns `{ error: "hearts" }` if the user has no hearts remaining.
 *  - Returns void and updates the database if the heart was successfully deducted.
 *
 * @example
 * // Attempt to reduce hearts for a failed challenge
 * const result = await reduceHearts(7);
 * if (result?.error === "hearts") {
 *   console.log("No hearts remaining!");
 * }
 *
 * @sideEffects
 * - Decrements the `hearts` field in the userProgress table by 1 (minimum 0).
 * - Revalidates the cache for "/shop", "/learn", "/quests", "/leaderboard",
 *   and the specific lesson path.
 */
export const reduceHearts = async (challengeId: number) => {
  // Retrieve the authenticated user's ID
  const { userId } = await auth();

  // Ensure the user is authenticated before proceeding
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Fetch the current user's progress and subscription status in parallel
  const currentUserProgress = await getUserProgress();
  const userSubscription = await getUserSubscription();

  // Look up the challenge to verify it exists and retrieve its lesson ID
  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  });

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  // Retrieve the lesson ID associated with this challenge for cache revalidation
  const lessonId = challenge.lessonId;

  // Check if the user has already completed this challenge (practice mode)
  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId),
    ),
  });

  // If the challenge was previously completed, treat it as practice (no heart loss)
  const isPractice = !!existingChallengeProgress;

  if (isPractice) {
    return { error: "practice" };
  }

  // Ensure the user has a progress record before modifying it
  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  // Active subscribers are immune to losing hearts
  if (userSubscription?.isActive) {
    return { error: "subscription" };
  }

  // Prevent further attempts if the user has no hearts left
  if (currentUserProgress.hearts === 0) {
    return { error: "hearts" };
  }

  // Deduct one heart, ensuring the count doesn't drop below 0
  await db
    .update(userProgress)
    .set({
      hearts: Math.max(currentUserProgress.hearts - 1, 0),
    })
    .where(eq(userProgress.userId, userId));

  // Invalidate cached data for all affected pages including the specific lesson
  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);
};

/**
 * Refills the user's hearts to the maximum value (5) in exchange for points.
 *
 * This function allows users to restore their hearts by spending a predefined
 * number of points (`POINTS_TO_REFILL`). Validates that the user has enough
 * points and that their hearts are not already at maximum capacity.
 *
 * @async
 * @function refillHearts
 *
 * @throws {Error} Throws "User progress not found" if no progress record exists for the user.
 * @throws {Error} Throws "Hearts are already full" if the user's heart count is already at 5.
 * @throws {Error} Throws "Not enough points to refill" if the user has insufficient points.
 *
 * @returns {Promise<void>} Resolves when hearts have been successfully refilled.
 *
 * @example
 * // Refill the user's hearts using their accumulated points
 * await refillHearts();
 *
 * @sideEffects
 * - Sets the `hearts` field to 5 in the userProgress table.
 * - Deducts `POINTS_TO_REFILL` from the user's `points` balance.
 * - Revalidates the cache for "/shop", "/learn", "/quests", and "/leaderboard" paths.
 */
export const refillHearts = async () => {
  // Fetch the current user's progress record
  const currentUserProgress = await getUserProgress();

  // Ensure a progress record exists for the user
  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  // Prevent refilling if hearts are already at the maximum value of 5
  if (currentUserProgress.hearts === 5) {
    throw new Error("Hearts are already full");
  }

  // Ensure the user has enough points to perform the refill
  if (currentUserProgress.points < POINTS_TO_REFILL) {
    throw new Error("Not enough points to refill");
  }

  // Refill hearts to maximum and deduct the required points from the user's balance
  await db
    .update(userProgress)
    .set({
      hearts: 5, // Restore to max hearts
      points: currentUserProgress.points - POINTS_TO_REFILL, // Deduct refill cost
    })
    .where(eq(userProgress.userId, currentUserProgress.userId));

  // Invalidate cached data for all pages affected by the points/hearts change
  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
};
