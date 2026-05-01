import Link from "next/link";

import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
}

/**
 * Header component for the learning path view.
 * Server Component
 *
 * @param props - {@link HeaderProps}
 * @returns A sticky header with a back button and the title of the current active course.
 *
 * @example
 * ```tsx
 * <Header title="Spanish" />
 * ```
 */
export const Header = ({ title }: HeaderProps) => {
  return (
    <div className="sticky top-0 bg-white pb-3 lg:pt-[28px] lg:mt-[-28px] flex items-center justify-between border-b-2 mb-5 text-neutral-400 lg:z-50">
      <Link href="/courses">
        <Button size="sm" variant="ghost">
          <ArrowLeftIcon className="stroke-2 size-5 text-neutral-400" />
        </Button>
      </Link>
      <h1 className="text-lg font-bold">{title}</h1>
      <div />
    </div>
  );
};
