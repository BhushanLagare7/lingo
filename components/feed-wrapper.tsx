/**
 * Layout wrapper for the main content feed area.
 * Server Component
 *
 * @param props - An object containing the child elements.
 * @param props.children - The main content elements to be rendered within the feed.
 * @returns A flex container that wraps the main content area with appropriate padding and positioning.
 *
 * @example
 * ```tsx
 * <FeedWrapper>
 *   <QuestsPage />
 * </FeedWrapper>
 * ```
 */
export const FeedWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative top-0 flex-1 pb-10">{children}</div>;
};
