import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Progress } from "@/components/ui/progress";
import { UserProgress } from "@/components/user-progress";
import { quests } from "@/constants";
import { getUserProgress, getUserSubscription } from "@/db/queries";

/**
 * Renders the Quests page showing a user's progress towards specific point milestones.
 * Server Component
 *
 * @returns The quests page UI containing user progress sidebars and a feed with available quests and their completion progress bars. Redirects to courses if no active course is found.
 *
 * @example
 * ```tsx
 * <QuestsPage />
 * ```
 */
const QuestsPage = async () => {
  const useProgressPromise = getUserProgress();
  const userSubscriptionPromise = getUserSubscription();

  const [userProgress, userSubscription] = await Promise.all([
    useProgressPromise,
    userSubscriptionPromise,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-12 px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hasActiveSubscription={isPro}
          hearts={userProgress.hearts}
          points={userProgress.points}
        />
        {!isPro && <Promo />}
      </StickyWrapper>
      <FeedWrapper>
        <div className="flex flex-col items-center w-full">
          <Image alt="Quests" height={90} src="/quests.svg" width={90} />
          <h1 className="my-6 text-2xl font-bold text-center text-neutral-800">
            Quests
          </h1>
          <p className="mb-6 text-lg text-center text-muted-foreground">
            Complete quests by earning points.
          </p>
          <ul className="w-full">
            {quests.map((quest) => {
              const progress = (userProgress.points / quest.value) * 100;

              return (
                <div
                  key={quest.title}
                  className="flex gap-x-4 items-center p-4 w-full border-t-2"
                >
                  <Image
                    alt="Points"
                    height={60}
                    src="/points.svg"
                    width={60}
                  />
                  <div className="flex flex-col gap-y-2 w-full">
                    <p className="text-xl font-bold text-neutral-700">
                      {quest.title}
                    </p>
                    <Progress className="h-3" value={progress} />
                  </div>
                </div>
              );
            })}
          </ul>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default QuestsPage;
