"use client";

import * as React from "react";

import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * A styled progress bar built on top of Radix UI primitives.
 * Client Component
 *
 * @param props - Standard component props for Radix UI Progress root, including `value` representing the percentage.
 * @returns A horizontal progress bar indicating completion percentage.
 *
 * @example
 * ```tsx
 * <Progress value={50} />
 * ```
 */
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      className={cn(
        "flex overflow-x-hidden relative items-center w-full h-1 rounded-full bg-muted",
        className,
      )}
      data-slot="progress"
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="flex-1 bg-green-500 transition-all size-full"
        data-slot="progress-indicator"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
