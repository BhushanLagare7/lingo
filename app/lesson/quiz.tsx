"use client";

import { useState } from "react";

import { challengeOptions, challenges, userSubscription } from "@/db/schema";

import { Header } from "./header";

interface QuizProps {
  initialHearts: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  initialLessonId: number;
  initialPercentage: number;
  userSubscription: typeof userSubscription.$inferSelect | null;
}

export const Quiz = ({
  initialHearts,
  initialLessonChallenges,
  initialLessonId,
  initialPercentage,
  userSubscription,
}: QuizProps) => {
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(initialPercentage);

  return (
    <>
      <Header
        hasActiveSubscription={!!userSubscription?.isActive}
        hearts={hearts}
        percentage={percentage}
      />
    </>
  );
};
