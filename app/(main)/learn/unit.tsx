import { lessons, units } from "@/db/schema";

import { LessonButton } from "./lesson-button";
import { UnitBanner } from "./unit-banner";

interface Props {
  id: number;
  title: string;
  description: string;
  order: number;
  activeLesson:
    | (typeof lessons.$inferSelect & {
        unit: typeof units.$inferSelect;
      })
    | undefined;
  activeLessonPercentage: number;
  lessons: (typeof lessons.$inferSelect & {
    completed: boolean;
  })[];
}

export const Unit = ({
  id,
  title,
  description,
  order,
  activeLesson,
  activeLessonPercentage,
  lessons,
}: Props) => {
  return (
    <>
      <UnitBanner description={description} title={title} />
      <div className="flex relative flex-col items-center">
        {lessons.map((lesson, index) => {
          const isCurrent = lesson.id === activeLesson?.id;
          const isLocked = !lesson.completed && !isCurrent;

          return (
            <LessonButton
              key={lesson.id}
              current={isCurrent}
              id={lesson.id}
              index={index}
              locked={isLocked}
              percentage={activeLessonPercentage}
              totalCount={lessons.length - 1}
            />
          );
        })}
      </div>
    </>
  );
};
