"use client";

/**
 * @fileoverview LessonButton Component
 *
 * A interactive button component that represents a single lesson in a course curriculum.
 * Features a zigzag/wave layout pattern, progress tracking, and different visual states
 * based on the lesson's completion status.
 *
 * @module LessonButton
 */

import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import Link from "next/link";

import { CheckIcon, CrownIcon, StarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import "react-circular-progressbar/dist/styles.css";

/**
 * Props for the LessonButton component
 *
 * @typedef {Object} Props
 * @property {number} id           - Unique identifier for the lesson, used to construct the lesson URL
 * @property {number} index        - Zero-based position of the lesson in the overall curriculum list
 * @property {number} totalCount   - Total number of lessons available in the curriculum
 * @property {boolean} [locked]    - When true, prevents navigation and renders the button in a locked/disabled state
 * @property {boolean} [current]   - When true, marks this as the active lesson with an animated "Start" indicator
 * @property {number} percentage   - Completion percentage (0-100) displayed in the circular progress bar for current lesson
 */
type Props = {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  percentage: number;
};

/**
 * LessonButton Component
 *
 * Renders an individual lesson button with the following features:
 * - **Zigzag Layout**: Buttons are horizontally offset based on their position,
 *   creating a wave-like visual path through the curriculum (cycle of 8 positions)
 * - **Visual States**:
 *   - `Completed`: Green check icon, navigates to the specific lesson (`/lesson/:id`)
 *   - `Current`:   Star icon with animated "Start" badge and circular progress bar
 *   - `Locked`:    Greyed-out appearance, navigation is disabled
 *   - `Last`:      Crown icon to signify the final lesson
 * - **Progress Tracking**: For the current lesson, displays completion percentage
 *   via a circular progress bar
 *
 * @example
 * // Completed lesson
 * <LessonButton id={1} index={0} totalCount={10} percentage={100} />
 *
 * @example
 * // Active/current lesson with 40% progress
 * <LessonButton id={2} index={1} totalCount={10} current percentage={40} />
 *
 * @example
 * // Locked lesson
 * <LessonButton id={3} index={2} totalCount={10} locked percentage={0} />
 *
 * @param {Props} props - Component props
 * @returns {JSX.Element} A linked, styled lesson button with appropriate icons and layout
 */
export const LessonButton = ({
  id,
  index,
  totalCount,
  locked,
  current,
  percentage,
}: Props) => {
  /**
   * The number of buttons in a single zigzag wave cycle.
   * After `cycleLength` buttons, the horizontal pattern repeats.
   */
  const cycleLength = 8;

  /**
   * The position of this button within the current wave cycle (0 to cycleLength - 1).
   * Used to determine horizontal indentation.
   */
  const cycleIndex = index % cycleLength;

  /**
   * Determines the horizontal indentation level for the zigzag layout.
   *
   * The indentation follows a wave pattern based on the cycle index:
   * - Positions 0-2 : Indent increases (moving right)
   * - Positions 3-4 : Indent decreases (moving back left)
   * - Positions 5-6 : Continues decreasing (moving further left)
   * - Position  7   : Returns toward center
   *
   * @type {number}
   */
  let indentationLevel;

  if (cycleIndex <= 2) {
    // Rising phase: move progressively to the right
    indentationLevel = cycleIndex;
  } else if (cycleIndex <= 4) {
    // Falling phase: move back toward center
    indentationLevel = 4 - cycleIndex;
  } else if (cycleIndex <= 6) {
    // Continuing to fall: move to the left of center
    indentationLevel = 4 - cycleIndex;
  } else {
    // Return phase: move back toward center from the left
    indentationLevel = cycleIndex - 8;
  }

  /**
   * The calculated pixel offset from the right side of the container.
   * Each indentation level corresponds to 40px of horizontal shift.
   *
   * @type {number}
   */
  const rightPosition = indentationLevel * 40;

  /** Whether this is the very first lesson in the curriculum */
  const isFirst = index === 0;

  /** Whether this is the very last lesson in the curriculum */
  const isLast = index === totalCount;

  /**
   * Whether the lesson has been completed.
   * A lesson is considered complete when it's neither the current lesson nor locked.
   */
  const isCompleted = !current && !locked;

  /**
   * The icon to display inside the button, based on lesson state:
   * - `CheckIcon`  → Lesson is completed
   * - `CrownIcon`  → Lesson is the last in the curriculum
   * - `StarIcon`   → Default (upcoming or current lesson)
   */
  const Icon = isCompleted ? CheckIcon : isLast ? CrownIcon : StarIcon;

  /**
   * Navigation href based on lesson state:
   * - Completed lessons link directly to their specific lesson page
   * - All other lessons link to the generic `/lesson` route
   */
  const href = isCompleted ? `/lesson/${id}` : "/lesson";

  return (
    /**
     * Wraps the button in a Next.js Link for client-side navigation.
     * Navigation is visually and functionally disabled for locked lessons
     * via `aria-disabled` and `pointer-events: none`.
     */
    <Link
      aria-disabled={locked}
      href={href}
      style={{ pointerEvents: locked ? "none" : "auto" }}
    >
      <div
        className="relative"
        style={{
          right: `${rightPosition}px`,
          // First incomplete lesson gets extra top margin to create visual separation
          marginTop: isFirst && !isCompleted ? 60 : 24,
        }}
      >
        {current ? (
          /**
           * Current Lesson Layout:
           * Renders an animated "Start" badge above the button,
           * wrapped in a CircularProgressbar to show completion progress.
           */
          <div className="size-25.5 relative">
            {/* Animated "Start" badge with a downward-pointing tooltip arrow */}
            <div className="absolute -top-6 left-2.5 px-3 py-2.5 border-2 font-bold uppercase text-green-500 bg-white rounded-xl animate-bounce tracking-wide z-10">
              Start
              {/* Tooltip arrow pointing downward toward the button */}
              <div className="absolute -bottom-2 left-1/2 w-0 h-0 border-t-8 transform -translate-x-1/2 border-x-8 border-x-transparent" />
            </div>

            {/* Circular progress bar showing lesson completion percentage */}
            <CircularProgressbarWithChildren
              styles={{
                path: {
                  stroke: "#4ADE80", // Green progress indicator
                },
                trail: {
                  stroke: "#E5E7EB", // Light grey track
                },
              }}
              // Guard against NaN values to ensure valid rendering
              value={Number.isNaN(percentage) ? 0 : percentage}
            >
              {/* Inner lesson button rendered as a child of the progress bar */}
              <Button
                className="size-17.5 border-b-8"
                size="rounded"
                variant={locked ? "locked" : "secondary"}
              >
                <Icon
                  className={cn(
                    "size-10",
                    locked
                      ? "fill-neutral-400 text-neutral-400 stroke-neutral-400" // Locked: grey tones
                      : "fill-primary-foreground text-primary-foreground", // Unlocked: primary colors
                    isCompleted && "fill-none stroke-4", // Completed: outline style
                  )}
                />
              </Button>
            </CircularProgressbarWithChildren>
          </div>
        ) : (
          /**
           * Non-Current Lesson Layout:
           * Renders a simple standalone button without progress bar or badge.
           */
          <Button
            className="size-17.5 border-b-8"
            size="rounded"
            variant={locked ? "locked" : "secondary"}
          >
            <Icon
              className={cn(
                "size-10",
                locked
                  ? "fill-neutral-400 text-neutral-400 stroke-neutral-400" // Locked: grey tones
                  : "fill-primary-foreground text-primary-foreground", // Unlocked: primary colors
                isCompleted && "fill-none stroke-4", // Completed: outline style
              )}
            />
          </Button>
        )}
      </div>
    </Link>
  );
};
