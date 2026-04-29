import { useEffect, useState } from "react";
import { useKey } from "react-use";

import { CheckCircleIcon, XCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  lessonId?: number;
};

export const Footer = ({ onCheck, status, disabled, lessonId }: Props) => {
  useKey("Enter", onCheck, {}, [onCheck]);

  // Hydration-safe media query: start with false (matches SSR),
  // then update to real value after mount to avoid mismatch.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1024px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(mql.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <footer
      className={cn(
        "h-25 border-t-2 lg:h-35",
        status === "correct" && "border-transparent bg-green-100",
        status === "wrong" && "border-transparent bg-rose-100",
      )}
    >
      <div className="flex justify-between items-center px-6 mx-auto h-full max-w-285 lg:px-10">
        {status === "correct" && (
          <div className="flex items-center text-base font-bold text-green-500 lg:text-2xl">
            <CheckCircleIcon className="mr-4 size-6 lg:size-10" />
            Nicely done!
          </div>
        )}
        {status === "wrong" && (
          <div className="flex items-center text-base font-bold text-rose-500 lg:text-2xl">
            <XCircleIcon className="mr-4 size-6 lg:size-10" />
            Try again.
          </div>
        )}
        {status === "completed" && (
          <Button
            size={isMobile ? "sm" : "lg"}
            variant="default"
            onClick={() => (window.location.href = `/lesson/${lessonId}`)}
          >
            Practice again
          </Button>
        )}
        <Button
          className="ml-auto"
          disabled={disabled}
          size={isMobile ? "sm" : "lg"}
          variant={status === "wrong" ? "danger" : "secondary"}
          onClick={onCheck}
        >
          {status === "none" && "Check"}
          {status === "correct" && "Next"}
          {status === "wrong" && "Retry"}
          {status === "completed" && "Continue"}
        </Button>
      </div>
    </footer>
  );
};
