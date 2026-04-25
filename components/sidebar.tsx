import Image from "next/image";
import Link from "next/link";

import { LoaderIcon } from "lucide-react";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";

import { SidebarItem } from "@/components/sidebar-item";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div
      className={cn(
        "flex top-0 left-0 flex-col px-4 h-full border-r-2 lg:w-64 lg:fixed",
        className,
      )}
    >
      <Link href="/learn">
        <div className="flex gap-x-3 items-center pt-8 pb-7 pl-4">
          <Image alt="Mascot" height={40} src="/mascot.svg" width={40} />
          <h1 className="text-2xl font-extrabold tracking-wide text-green-600">
            Lingo
          </h1>
        </div>
      </Link>
      <div className="flex flex-col flex-1 gap-y-2">
        <SidebarItem href="/learn" iconSrc="/learn.svg" label="Learn" />
        <SidebarItem
          href="/leaderboard"
          iconSrc="/leaderboard.svg"
          label="Leaderboard"
        />
        <SidebarItem href="/quests" iconSrc="/quests.svg" label="Quests" />
        <SidebarItem href="/shop" iconSrc="/shop.svg" label="Shop" />
      </div>
      <div className="p-4">
        <ClerkLoading>
          <LoaderIcon className="animate-spin size-5 text-muted-foreground" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton />
        </ClerkLoaded>
      </div>
    </div>
  );
};
