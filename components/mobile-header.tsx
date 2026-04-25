import { MobileSidebar } from "@/components/mobile-sidebar";

export const MobileHeader = () => {
  return (
    <nav className="px-6 h-12.5 flex items-center bg-green-500 border-b fixed top-0 w-full z-50 lg:hidden ">
      <MobileSidebar />
    </nav>
  );
};
