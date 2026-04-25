import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MobileHeader />
      <Sidebar className="hidden lg:flex" />
      <main className="h-full pt-12.5 lg:pt-0 lg:pl-64">
        <div className="pt-6 mx-auto h-full max-w-264">{children}</div>
      </main>
    </>
  );
};

export default MainLayout;
