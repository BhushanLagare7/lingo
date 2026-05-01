import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";

/**
 * Layout wrapper for main application pages (e.g. learn, shop, leaderboard).
 * Server Component
 *
 * @param props - An object containing the child components to render.
 * @param props.children - The main page content to render inside the layout.
 * @returns The structure featuring a desktop sidebar, mobile header, and the main content area.
 *
 * @example
 * ```tsx
 * <MainLayout>
 *   <LearnPage />
 * </MainLayout>
 * ```
 */
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
