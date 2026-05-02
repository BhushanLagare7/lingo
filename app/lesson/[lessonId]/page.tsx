import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Quiz } from "@/app/lesson/quiz";
import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";

interface LessonIdPageProps {
  params: Promise<{
    lessonId: number;
  }>;
}

export async function generateMetadata({ params }: LessonIdPageProps): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = await getLesson(lessonId);

  if (!lesson) {
    return {
      title: "Lesson Not Found",
    };
  }

  return {
    title: `Lesson ${lesson.id} - ${lesson.title}`,
    description: `Complete lesson ${lesson.id} challenges to earn points.`,
  };
}

/**
 * Server-rendered page for a specific lesson within a course.
 * Server Component
 *
 * @param props - {@link LessonIdPageProps}
 * @returns Renders the `Quiz` client component populated with the specific lesson's data. Redirects to `/learn` if not found.
 *
 * @example
 * ```tsx
 * <LessonIdPage params={{ lessonId: 1 }} />
 * ```
 */
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
