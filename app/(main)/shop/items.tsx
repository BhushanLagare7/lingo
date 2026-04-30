"use client";

import { useTransition } from "react";
import Image from "next/image";

import { toast } from "sonner";

import { refillHearts } from "@/actions/user-progress";
import { createStripeUrl } from "@/actions/user-subscription";
import { Button } from "@/components/ui/button";

// TODO: Move alongside Item component constants into a shared constants file
const POINTS_TO_REFILL = 10;

interface ItemsProps {
  hasActiveSubscription: boolean;
  hearts: number;
  points: number;
}

export const Items = ({
  hasActiveSubscription,
  hearts,
  points,
}: ItemsProps) => {
  const [pending, startTransition] = useTransition();

  const onRefillHearts = () => {
    if (pending || hearts === 5 || points < POINTS_TO_REFILL) return;

    startTransition(() => {
      refillHearts().catch(() => {
        toast.error("Failed to refill hearts");
      });
    });
  };

  const onUpgrade = () => {
    startTransition(() => {
      createStripeUrl()
        .then((response) => {
          if (response.data) {
            window.location.href = response.data;
          }
        })
        .catch(() => {
          toast.error("Failed to upgrade");
        });
    });
  };

  return (
    <ul className="w-full">
      <div className="flex gap-x-4 items-center p-4 w-full border-t-2">
        <Image alt="Heart" height={60} src="/heart.svg" width={60} />
        <div className="flex-1">
          <p className="text-base font-bold text-neutral-700 lg:text-lg">
            Refill hearts
          </p>
        </div>
        <Button
          disabled={pending || hearts === 5 || points < POINTS_TO_REFILL}
          onClick={onRefillHearts}
        >
          {hearts === 5 ? (
            "Full"
          ) : (
            <div className="flex items-center">
              <Image alt="Points" height={20} src="/points.svg" width={20} />
              <p>{POINTS_TO_REFILL}</p>
            </div>
          )}
        </Button>
      </div>
      <div className="flex gap-x-4 items-center p-4 w-full border-t-2">
        <Image alt="Unlimited" height={60} src="/unlimited.svg" width={60} />
        <div className="flex-1">
          <p className="text-base font-bold text-neutral-700 lg:text-lg">
            Unlimited hearts
          </p>
        </div>
        <Button disabled={pending} onClick={onUpgrade}>
          {hasActiveSubscription ? "Settings" : "Upgrade"}
        </Button>
      </div>
    </ul>
  );
};
