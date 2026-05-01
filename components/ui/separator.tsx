"use client";

import * as React from "react";

import { Separator as SeparatorPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * A visual divider component to separate content vertically or horizontally.
 * Client Component
 *
 * @param props - Extends Radix UI Separator properties, including orientation and styling options.
 * @returns A stylized line element (horizontal or vertical) for visual grouping.
 *
 * @example
 * ```tsx
 * <Separator orientation="horizontal" />
 * ```
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className,
      )}
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      {...props}
    />
  );
}

export { Separator };
