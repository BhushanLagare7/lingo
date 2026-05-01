/**
 * Layout wrapper for the main content feed area.
 * Server Component
 *
 * @param props - An object containing the child elements.
 * @param props.children - The main content elements to be rendered within the feed.
 * @returns A flex child that grows to fill available space (using className="flex-1") and wraps/renders props.children as the main content.
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
