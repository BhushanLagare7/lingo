import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
} from "@/db/queries";

import { Header } from "./header";
import { Unit } from "./unit";

const LearnPage = async () => {
  const userProgressPromise = getUserProgress();
  const courseProgressPromise = getCourseProgress();
  const lessonPercentagePromise = getLessonPercentage();
  const unitsPromise = getUnits();

  const [userProgress, courseProgress, lessonPercentage, units] =
    await Promise.all([
      userProgressPromise,
      courseProgressPromise,
      lessonPercentagePromise,
      unitsPromise,
    ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  if (!courseProgress) {
    redirect("/courses");
  }

  return (
    <div className="flex flex-row-reverse gap-12 px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hasActiveSubscription={false}
          hearts={userProgress.hearts}
          points={userProgress.points}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              activeLesson={courseProgress.activeLesson}
              activeLessonPercentage={lessonPercentage}
              description={unit.description}
              id={unit.id}
              lessons={unit.lessons}
              order={unit.order}
              title={unit.title}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;
