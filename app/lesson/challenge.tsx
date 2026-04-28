import { challengeOptions, challenges } from "@/db/schema";
import { cn } from "@/lib/utils";

import { Card } from "./card";

interface ChallengeProps {
  disabled?: boolean;
  options: (typeof challengeOptions.$inferSelect)[];
  selectedOption?: number;
  status: "correct" | "wrong" | "none";
  type: typeof challenges.$inferSelect.type;
  onSelect: (id: number) => void;
}

export const Challenge = ({
  disabled,
  options,
  selectedOption,
  status,
  type,
  onSelect,
}: ChallengeProps) => {
  return (
    <div
      className={cn(
        "grid gap-2",
        type === "ASSIST" && "grid-cols-1",
        type === "SELECT" &&
          "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]",
      )}
    >
      {options.map((option, index) => (
        <Card
          key={option.id}
          audioSrc={option.audioSrc}
          disabled={disabled}
          id={option.id}
          imageSrc={option.imageSrc}
          selected={selectedOption === option.id}
          shortcut={`${index + 1}`}
          status={status}
          text={option.text}
          type={type}
          onClick={() => onSelect(option.id)}
        />
      ))}
    </div>
  );
};
