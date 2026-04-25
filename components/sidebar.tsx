import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div
      className={cn(
        "flex top-0 left-0 flex-col px-4 h-full bg-blue-500 border-r-2 lg:w-64 lg:fixed",
        className,
      )}
    >
      Sidebar
    </div>
  );
};
