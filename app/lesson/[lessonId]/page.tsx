import { redirect } from "next/navigation";

import { Quiz } from "@/app/lesson/quiz";
import { getLesson, getUserProgress } from "@/db/queries";

interface LessonIdPageProps {
  params: {
    lessonId: number;
  };
}

const LessonIdPage = async ({ params }: LessonIdPageProps) => {
  const { lessonId } = await params;

  const lessonPromise = getLesson(lessonId);
  const userProgressPromise = getUserProgress();

  const [lesson, userProgress] = await Promise.all([
    lessonPromise,
    userProgressPromise,
  ]);

  if (!lesson || !userProgress) {
    redirect("/learn");
  }

  const initialPercentage =
    (lesson.challenges.filter((challenge) => challenge.completed).length /
      lesson.challenges.length) *
    100;

  return (
    <Quiz
      initialHearts={userProgress.hearts}
      initialLessonChallenges={lesson.challenges}
      initialLessonId={lesson.id}
      initialPercentage={initialPercentage}
      userSubscription={null} // TODO: Add user subscription
    />
  );
};

export default LessonIdPage;
