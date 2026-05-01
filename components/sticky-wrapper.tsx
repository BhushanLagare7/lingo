/**
 * A layout wrapper that pins its children to the screen viewport during scrolling.
 * Server Component
 *
 * @param props - An object containing the child elements.
 * @param props.children - The content to be made sticky (e.g., sidebars, widgets).
 * @returns A responsive wrapper that is hidden on mobile and uses CSS sticky positioning on desktop displays.
 *
 * @example
 * ```tsx
 * <StickyWrapper>
 *   <UserProgress />
 * </StickyWrapper>
 * ```
 */
export const StickyWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="hidden sticky bottom-6 self-end w-92 lg:block">
      <div className="flex flex-col gap-y-4 min-h-[calc(100vh-48px)] sticky top-6 ">
        {children}
      </div>
    </div>
  );
};
