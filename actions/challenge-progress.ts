/**
 * @file challenge-progress.ts
 * @description Server-side actions for managing challenge progress updates.
 * Handles both new challenge completions and practice sessions,
 * managing user hearts and points accordingly.
 */

"use server";

import { revalidatePath } from "next/cache";

import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import db from "@/db/drizzle";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";

/**
 * Upserts (inserts or updates) a user's progress for a specific challenge.
 *
 * @description
 * This server action handles two scenarios:
 * - **Practice Mode**: When the user has already completed the challenge before,
 *   updates existing progress, restores a heart (max 5), and awards 10 points.
 * - **New Completion**: When the user completes a challenge for the first time,
 *   inserts new progress and awards 10 points without restoring hearts.
 *
 * @param {number} challengeId - The unique identifier of the challenge being completed.
 *
 * @returns {Promise<{ error: string } | void>}
 * - Returns `{ error: "hearts" }` if the user has no hearts remaining,
 *   no active subscription, and is not in practice mode.
 * - Returns `void` on successful progress update.
 *
 * @throws {Error} Throws "Unauthorized" if no authenticated user is found.
 * @throws {Error} Throws "User progress not found" if the user's progress
 *                 record doesn't exist in the database.
 * @throws {Error} Throws "Challenge not found" if the specified challenge ID
 *                 doesn't match any challenge in the database.
 *
 * @example
 * // In a client component or another server action
 * const result = await upsertChallengeProgress(42);
 *
 * if (result?.error === "hearts") {
 *   console.log("User has no hearts remaining!");
 * }
 */
export const upsertChallengeProgress = async (challengeId: number) => {
  // Retrieve the authenticated user's ID from Clerk
  const { userId } = await auth();

  // Guard clause: Ensure user is authenticated before proceeding
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Fetch current user progress and subscription status in parallel
  const currentUserProgress = await getUserProgress();
  const userSubscription = await getUserSubscription();

  // Guard clause: Ensure user progress record exists
  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  // Fetch the challenge details using the provided challenge ID
  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  });

  // Guard clause: Ensure the challenge exists in the database
  if (!challenge) {
    throw new Error("Challenge not found");
  }

  // Extract the lesson ID for cache revalidation later
  const lessonId = challenge.lessonId;

  /**
   * Check if the user has previously completed this challenge.
   * This determines whether the session is a practice session or a new attempt.
   */
  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId),
    ),
  });

  /**
   * Determine if this is a practice session.
   * A session is considered practice if the challenge has been completed before.
   */
  const isPractice = !!existingChallengeProgress;

  /**
   * Heart validation: Block progress if all conditions are met:
   * - User has no hearts remaining (hearts === 0)
   * - User does not have an active subscription (no unlimited hearts)
   * - This is not a practice session (practice sessions don't cost hearts)
   */
  if (
    currentUserProgress.hearts === 0 &&
    !userSubscription?.isActive &&
    !isPractice
  ) {
    return { error: "hearts" };
  }

  /**
   * Handle Practice Session:
   * - Mark the existing challenge progress as completed
   * - Restore one heart (capped at a maximum of 5)
   * - Award 10 points for practice completion
   * - Revalidate all affected page caches
   */
  if (isPractice) {
    // Update the existing challenge progress to mark it as completed
    await db
      .update(challengeProgress)
      .set({
        completed: true,
      })
      .where(eq(challengeProgress.id, existingChallengeProgress.id));

    // Reward the user: restore one heart (max 5) and add 10 points
    await db
      .update(userProgress)
      .set({
        hearts: Math.min(currentUserProgress.hearts + 1, 5), // Cap hearts at 5
        points: currentUserProgress.points + 10, // Award 10 points
      })
      .where(eq(userProgress.userId, userId));

    // Revalidate cached pages to reflect updated progress and points
    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);

    return;
  }

  /**
   * Handle New Challenge Completion:
   * - Insert a new challenge progress record marked as completed
   * - Award 10 points (no heart restoration for first-time completions)
   * - Revalidate all affected page caches
   */

  // Insert a new progress record for this challenge
  await db.insert(challengeProgress).values({
    userId,
    challengeId,
    completed: true,
  });

  // Award 10 points for completing a new challenge
  await db
    .update(userProgress)
    .set({
      points: currentUserProgress.points + 10,
    })
    .where(eq(userProgress.userId, userId));

  // Revalidate cached pages to reflect updated progress and points
  revalidatePath("/learn");
  revalidatePath("/lesson");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);
};
