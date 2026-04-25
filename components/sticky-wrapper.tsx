export const StickyWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="hidden sticky bottom-6 self-end w-92 lg:block">
      <div className="flex flex-col gap-y-4 min-h-[calc(100vh-48px)] sticky top-6 ">
        {children}
      </div>
    </div>
  );
};
