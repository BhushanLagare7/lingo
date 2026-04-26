"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { upsertUserProgress } from "@/actions/user-progress";
import { courses, userProgress } from "@/db/schema";

import { Card } from "./card";

interface ListProps {
  courses: (typeof courses.$inferSelect)[];
  activeCourseId?: typeof userProgress.$inferSelect.activeCourseId;
}

export const List = ({ activeCourseId, courses }: ListProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleClick = (id: number) => {
    if (pending) return;

    if (id === activeCourseId) return router.push("/learn");

    startTransition(() => {
      upsertUserProgress(id).catch((error) => {
        // TODO: This is temporary, will use a proper error boundary
        // when we implement the final routing logic.
        if (error?.message === "NEXT_REDIRECT") return;
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
