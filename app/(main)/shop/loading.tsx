import { LoaderIcon } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <LoaderIcon className="animate-spin text-muted-foreground size-6" />
    </div>
  );
};

export default Loading;
