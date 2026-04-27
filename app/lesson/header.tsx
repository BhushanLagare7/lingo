import Image from "next/image";

import { InfinityIcon, XIcon } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { useExitModal } from "@/store/use-exit-modal";

interface HeaderProps {
  hasActiveSubscription: boolean;
  hearts: number;
  percentage: number;
}

export const Header = ({
  hasActiveSubscription,
  hearts,
  percentage,
}: HeaderProps) => {
  const { open } = useExitModal();

  return (
    <header className="flex items-center justify-between max-w-285 mx-auto w-full pt-5 px-10 gap-x-7 lg:pt-12.5">
      <XIcon
        className="transition cursor-pointer text-neutral-400 hover:opacity-75"
        onClick={open}
      />
      <Progress value={percentage} />
      <div className="flex items-center font-bold text-rose-500">
        <Image
          alt="Heart"
          className="mr-2"
          height={28}
          src="/heart.svg"
          width={28}
        />
        {hasActiveSubscription ? (
          <InfinityIcon className="size-6 stroke-3" />
        ) : (
          hearts
        )}
      </div>
    </header>
  );
};
