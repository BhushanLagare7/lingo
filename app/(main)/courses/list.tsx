"use client";

import { useTransition } from "react";
import { unstable_rethrow, useRouter } from "next/navigation";

import { toast } from "sonner";

import { upsertUserProgress } from "@/actions/user-progress";
import { courses, userProgress } from "@/db/schema";

import { Card } from "./card";

interface ListProps {
  courses: (typeof courses.$inferSelect)[];
  activeCourseId?: typeof userProgress.$inferSelect.activeCourseId;
}

/**
 * Renders a grid of course cards allowing users to view and select courses to learn.
 * Client Component
 *
 * @param props - {@link ListProps}
 * @returns A responsive grid of `Card` components representing available courses. Handles course selection interactions and redirects to the learn page.
 *
 * @example
 * ```tsx
 * <List courses={coursesArray} activeCourseId={1} />
 * ```
 */
export const List = ({ activeCourseId, courses }: ListProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleClick = (id: number) => {
    if (pending) return;

    if (id === activeCourseId) return router.push("/learn");

    startTransition(() => {
      upsertUserProgress(id).catch((error) => {
        unstable_rethrow(error);
        toast.error("Failed to start course");
      });
    });
  };

  return (
    <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
      {courses.map((course) => (
        <Card
          key={course.id}
          active={course.id === activeCourseId}
          disabled={pending}
          id={course.id}
          imageSrc={course.imageSrc}
          title={course.title}
          onClick={handleClick}
        />
      ))}
    </div>
  );
};
