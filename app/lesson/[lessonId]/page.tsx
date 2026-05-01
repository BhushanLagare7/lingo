import { redirect } from "next/navigation";

import { Quiz } from "@/app/lesson/quiz";
import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";

interface LessonIdPageProps {
  params: {
    lessonId: number;
  };
}

const LessonIdPage = async ({ params }: LessonIdPageProps) => {
  const { lessonId } = await params;

  const lessonPromise = getLesson(lessonId);
  const userProgressPromise = getUserProgress();
  const userSubscriptionPromise = getUserSubscription();

  const [lesson, userProgress, userSubscription] = await Promise.all([
    lessonPromise,
    userProgressPromise,
    userSubscriptionPromise,
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
      userSubscription={userSubscription}
    />
  );
};

export default LessonIdPage;
