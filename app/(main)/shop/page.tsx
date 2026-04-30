import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress, getUserSubscription } from "@/db/queries";

import { Items } from "./items";

const ShopPage = async () => {
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
      </StickyWrapper>
      <FeedWrapper>
        <div className="flex flex-col items-center w-full">
          <Image alt="Shop" height={90} src="/shop.svg" width={90} />
          <h1 className="my-6 text-2xl font-bold text-center text-neutral-800">
            Shop
          </h1>
          <p className="mb-6 text-lg text-center text-muted-foreground">
            Spend your points on cool stuff.
          </p>
          <Items
            hasActiveSubscription={isPro}
            hearts={userProgress.hearts}
            points={userProgress.points}
          />
        </div>
      </FeedWrapper>
    </div>
  );
};

export default ShopPage;
