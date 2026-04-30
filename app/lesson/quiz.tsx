"use client";

import { useState, useTransition } from "react";
import Confetti from "react-confetti";
import { useAudio, useWindowSize } from "react-use";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import { challengeOptions, challenges, userSubscription } from "@/db/schema";

import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { ResultCard } from "./result-card";

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
  const { height, width } = useWindowSize();
  const router = useRouter();

  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });
  const [incorrectAudio, _i, incorrectControls] = useAudio({
    src: "/incorrect.wav",
  });

  const [lessonId] = useState(initialLessonId);
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
  const [isPending, startTransition] = useTransition();

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  const onSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id);
  };

  const onContinue = () => {
    if (!selectedOption) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((option) => option.correct);

    if (!correctOption) {
      return;
    }

    if (correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              console.error("Error: Not enough hearts");
              return;
            }

            correctControls.play();
            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);

            // This is a practice
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch(() => {
            toast.error("Something went wrong. Please try again.");
          });
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              console.error("Error: Not enough hearts");
              return;
            }

            incorrectControls.play();
            setStatus("wrong");

            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    }
  };

  if (!challenge) {
    return (
      <>
        <audio autoPlay src="/finish.mp3" />
        <Confetti
          height={height}
          numberOfPieces={500}
          recycle={false}
          tweenDuration={10_000}
          width={width}
        />
        <div className="flex flex-col gap-y-4 justify-center items-center mx-auto max-w-lg h-full text-center lg:gap-y-8">
          <Image
            alt="Finish"
            className="hidden lg:block"
            height={100}
            src="/finish.svg"
            width={100}
          />
          <Image
            alt="Finish"
            className="block lg:hidden"
            height={50}
            src="/finish.svg"
            width={50}
          />
          <h1 className="text-xl font-bold text-neutral-700 lg:text-3xl">
            Great Job! <br /> You&apos;ve completed the lesson.
          </h1>
          <div className="flex gap-x-4 items-center w-full">
            <ResultCard value={challenges.length * 10} variant="points" />
            <ResultCard value={hearts} variant="hearts" />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    );
  }

  const title =
    challenge.type === "ASSIST"
      ? "Select the correct meaning"
      : challenge.question;

  return (
    <>
      {incorrectAudio}
      {correctAudio}
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
                disabled={isPending}
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
      <Footer
        disabled={isPending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};
