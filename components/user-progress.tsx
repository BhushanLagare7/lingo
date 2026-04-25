import Image from "next/image";
import Link from "next/link";

import { InfinityIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface UserProgressProps {
  activeCourse: {
    title: string;
    imageSrc: string;
  }; // TODO: Replace with actual DB types
  hasActiveSubscription: boolean;
  hearts: number;
  points: number;
}

export const UserProgress = ({
  activeCourse,
  hasActiveSubscription,
  hearts,
  points,
}: UserProgressProps) => {
  return (
    <div className="flex gap-x-2 justify-between items-center w-full">
      <Link href="/courses">
        <Button variant="ghost">
          <Image
            alt={activeCourse.title}
            className="rounded-md border"
            height={32}
            src={activeCourse.imageSrc}
            width={32}
          />
        </Button>
      </Link>
      <Link href="/shop">
        <Button className="text-orange-500" variant="ghost">
          <Image
            alt="Points"
            className="mr-2"
            height={28}
            src="/points.svg"
            width={28}
          />
          {points}
        </Button>
      </Link>
      <Link href="/shop">
        <Button className="text-rose-500" variant="ghost">
          <Image
            alt="Hearts"
            className="mr-2"
            height={22}
            src="/heart.svg"
            width={22}
          />
          {hasActiveSubscription ? (
            <InfinityIcon className="size-4 stroke-3" />
          ) : (
            hearts
          )}
        </Button>
      </Link>
    </div>
  );
};
