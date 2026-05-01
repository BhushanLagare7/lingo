import { LoaderIcon } from "lucide-react";

/**
 * Loading state component for the courses page.
 * Server Component
 *
 * @returns A full-height container centering an animated spinner to indicate the courses page is loading.
 *
 * @example
 * ```tsx
 * <Loading />
 * ```
 */
const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <LoaderIcon className="animate-spin text-muted-foreground size-6" />
    </div>
  );
};

export default Loading;
