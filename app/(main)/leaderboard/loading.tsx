import { LoaderIcon } from "lucide-react";

/**
 * Loading state component for the leaderboard page.
 * Server Component
 *
 * @returns A full-height container centering an animated spinner to indicate the leaderboard page is loading.
 *
 * @example
 * ```tsx
 * <Loading />
 * ```
 */
const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <LoaderIcon className="animate-spin text-muted-foreground size-6" />
    </div>
  );
};

export default Loading;
