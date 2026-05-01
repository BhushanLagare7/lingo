import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { quests } from "@/constants";

interface QuestsProps {
  points: number;
}

export const Quests = ({ points }: QuestsProps) => {
  return (
    <div className="p-4 space-y-4 rounded-xl border-2">
      <div className="flex justify-between items-center space-y-2 w-full">
        <h3 className="text-lg font-bold">Quests</h3>
        <Link href="/quests">
          <Button size="sm" variant="primary-outline">
            View all
          </Button>
        </Link>
      </div>
      <ul className="space-y-4 w-full">
        {quests.map((quest) => {
          const progress = (points / quest.value) * 100;

          return (
            <div
              key={quest.title}
              className="flex gap-x-3 items-center pb-4 w-full"
            >
              <Image alt="Points" height={40} src="/points.svg" width={40} />
              <div className="flex flex-col gap-y-2 w-full">
                <p className="text-sm font-bold text-neutral-700">
                  {quest.title}
                </p>
                <Progress className="h-2" value={progress} />
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};
