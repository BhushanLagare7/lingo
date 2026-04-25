import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MobileHeader />
      <Sidebar className="hidden lg:flex" />
      <main className="lg:pl-64 h-full pt-12.5 lg:pt-0">
        <div className="h-full bg-red-500">{children}</div>
      </main>
    </>
  );
};

export default MainLayout;
