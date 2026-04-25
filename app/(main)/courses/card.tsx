import Image from "next/image";

import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface CardProps {
  id: number;
  imageSrc: string;
  title: string;
  onClick: (id: number) => void;
  active?: boolean;
  disabled?: boolean;
}

export const Card = ({
  id,
  imageSrc,
  title,
  onClick,
  active,
  disabled,
}: CardProps) => {
  return (
    <div
      className={cn(
        "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 cursor-pointer active:border-b-2 flex flex-col items-center justify-between p-3 pb-6 min-h-54.25 min-w-50",
        disabled && "opacity-50 pointer-events-none",
      )}
      onClick={() => onClick(id)}
    >
      <div className="min-h-6 w-full flex items-center justify-end">
        {active && (
          <div className="rounded-md bg-green-600 flex items-center justify-center p-1.5">
            <CheckIcon className="text-white stroke-4 size-4" />
          </div>
        )}
      </div>
      <Image
        alt={title}
        className="rounded-lg drop-shadow-md border object-cover"
        height={70}
        src={imageSrc}
        width={93.33}
      />
      <p className="text-neutral-700 text-center font-bold mt-3">{title}</p>
    </div>
  );
};
