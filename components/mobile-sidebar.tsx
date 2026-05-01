import { MenuIcon } from "lucide-react";

import { Sidebar } from "@/components/sidebar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Mobile-specific off-canvas navigation sidebar.
 * Client Component
 *
 * @returns A Radix UI Sheet component that slides out from the left edge on mobile devices, displaying the main `Sidebar` content.
 *
 * @example
 * ```tsx
 * <MobileSidebar />
 * ```
 */
export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <MenuIcon className="text-white" />
      </SheetTrigger>
      <SheetContent className="p-0 z-100" side="left">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
