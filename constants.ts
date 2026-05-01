/**
 * @file constants.ts
 * @description Centralized storage for application constants used across different modules.
 * Includes constants for currency refilling, user quests, and time calculations.
 */

/**
 * Number of points required to refill hearts
 * @type {number}
 */
export const POINTS_TO_REFILL = 10;

/**
 * User quests for earning experience points
 * @type {Array<Object>}
 * @property {string} title - Title of the quest
 * @property {number} value - Value of the quest (points to earn)
 *
 * @example
 * // Example quests:
 * // { title: "Earn 20 XP", value: 20 }
 * // { title: "Earn 50 XP", value: 50 }
 * // { title: "Earn 100 XP", value: 100 }
 * // { title: "Earn 500 XP", value: 500 }
 * // { title: "Earn 1000 XP", value: 1000 }
 */
export const quests = [
  { title: "Earn 20 XP", value: 20 },
  { title: "Earn 50 XP", value: 50 },
  { title: "Earn 100 XP", value: 100 },
  { title: "Earn 500 XP", value: 500 },
  { title: "Earn 1000 XP", value: 1000 },
];

/**
 * Milliseconds in one day
 * @type {number}
 */
export const DAY_IN_MS = 86_400_000;
