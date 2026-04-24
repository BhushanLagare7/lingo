import { Footer } from "./footer";
import { Header } from "./header";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col flex-1 justify-center items-center">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
