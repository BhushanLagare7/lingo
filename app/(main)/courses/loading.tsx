import { LoaderIcon } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <LoaderIcon className="animate-spin text-muted-foreground size-6" />
    </div>
  );
};

export default Loading;
