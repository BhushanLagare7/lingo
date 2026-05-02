import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserProgress } from "@/components/user-progress";
import {
  getTopTenUsers,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";

export const metadata = {
  title: "Leaderboard",
  description: "See where you stand among other learners in the community.",
};

/**
 * Renders the Leaderboard page displaying top users ranked by experience points.
 * Server Component
 *
 * @returns The leaderboard UI containing user progress sidebars, and a feed displaying the top 10 users with their avatars and points. Redirects to courses if no active course is found.
 *
 * @example
 * ```tsx
 * <LeaderBoardPage />
 * ```
 */
const LeaderBoardPage = async () => {
  const useProgressPromise = getUserProgress();
  const userSubscriptionPromise = getUserSubscription();
  const topTenUsersPromise = getTopTenUsers();

  const [userProgress, userSubscription, leaderboard] = await Promise.all([
    useProgressPromise,
    userSubscriptionPromise,
    topTenUsersPromise,
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
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <div className="flex flex-col items-center w-full">
          <Image
            alt="Leaderboard"
            height={90}
            src="/leaderboard.svg"
            width={90}
          />
          <h1 className="my-6 text-2xl font-bold text-center text-neutral-800">
            Leaderboard
          </h1>
          <p className="mb-6 text-lg text-center text-muted-foreground">
            See where you stand among other learners in the community.
          </p>
          <Separator className="mb-4 h-0.5 rounded-full" />
          {leaderboard.map((userProgress, index) => (
            <div
              key={userProgress.userId}
              className="flex items-center p-2 px-4 w-full rounded-xl hover:bg-gray-200/50"
            >
              <p className="mr-4 font-bold text-lime-700">{index + 1}</p>
              <Avatar className="mr-6 ml-3 bg-green-500 border size-12">
                <AvatarImage
                  alt={userProgress.userName}
                  className="object-cover"
                  src={userProgress.userImageSrc}
                />
                <AvatarFallback>
                  {userProgress.userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <p className="flex-1 font-bold text-neutral-800">
                {userProgress.userName}
              </p>
              <p className="text-muted-foreground">{userProgress.points} XP</p>
            </div>
          ))}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LeaderBoardPage;
