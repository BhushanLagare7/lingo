"use client";

import { useState } from "react";

import { challengeOptions, challenges, userSubscription } from "@/db/schema";

import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";

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
  const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");
  const [percentage, setPercentage] = useState(initialPercentage);
  const [challenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed,
    );
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });
  const [selectedOption, setSelectedOption] = useState<number>();

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  const onSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id);
  };

  const title =
    challenge.type === "ASSIST"
      ? "Select the correct meaning"
      : challenge.question;

  return (
    <>
      <Header
        hasActiveSubscription={!!userSubscription?.isActive}
        hearts={hearts}
        percentage={percentage}
      />
      <div className="flex-1">
        <div className="flex justify-center items-center h-full">
          <div className="flex gap-y-12 flex-col w-full px-6 lg:min-h-87.5 lg:w-150 lg:px-0">
            <h1 className="text-lg font-bold text-center lg:text-3xl lg:text-start text-neutral-700">
              {title}
            </h1>
            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge
                disabled={false}
                options={options}
                selectedOption={selectedOption}
                status={status}
                type={challenge.type}
                onSelect={onSelect}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer disabled={!selectedOption} status={status} onCheck={() => {}} />
    </>
  );
};
