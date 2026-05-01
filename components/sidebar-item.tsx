"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  href: string;
  iconSrc: string;
  label: string;
}

/**
 * Individual navigation link item for the application sidebar.
 * Client Component
 *
 * @param props - {@link SidebarItemProps}
 * @returns A stylized button containing an icon and label that navigates to a specific route, highlighting if currently active.
 *
 * @example
 * ```tsx
 * <SidebarItem href="/learn" iconSrc="/learn.svg" label="Learn" />
 * ```
 */
export const SidebarItem = ({ href, iconSrc, label }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button
      asChild
      className="justify-start h-13"
      variant={isActive ? "sidebar-outline" : "sidebar"}
    >
      <Link href={href}>
        <Image
          alt={label}
          className="mr-5"
          height={32}
          src={iconSrc}
          width={32}
        />
        {label}
      </Link>
    </Button>
  );
};
