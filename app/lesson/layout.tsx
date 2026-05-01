/**
 * Basic layout wrapper for the lesson quiz interface.
 * Server Component
 *
 * @param props - An object containing the child components.
 * @param props.children - The lesson content.
 * @returns A full-height flexbox container to ensure the lesson fills the screen.
 *
 * @example
 * ```tsx
 * <LessonLayout>
 *   <LessonPage />
 * </LessonLayout>
 * ```
 */
const LessonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col size-full">{children}</div>
    </div>
  );
};

export default LessonLayout;
