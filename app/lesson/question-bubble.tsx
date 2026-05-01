import Image from "next/image";

interface QuestionBubbleProps {
  question: string;
}

/**
 * Displays a speech bubble alongside a mascot avatar to present a question or prompt.
 * Server Component
 *
 * @param props - {@link QuestionBubbleProps}
 * @returns A UI component with the Lingo mascot "speaking" the provided question text.
 *
 * @example
 * ```tsx
 * <QuestionBubble question="What does this mean?" />
 * ```
 */
export const QuestionBubble = ({ question }: QuestionBubbleProps) => {
  return (
    <div className="flex gap-x-6 items-center mb-6">
      <Image
        alt="Mascot"
        className="hidden lg:block"
        height={60}
        src="/mascot.svg"
        width={60}
      />
      <Image
        alt="Mascot"
        className="block lg:hidden"
        height={40}
        src="/mascot.svg"
        width={40}
      />
      <div className="relative px-4 py-2 text-sm rounded-xl border-2 lg:text-base">
        {question}
        <div className="absolute -left-3 top-1/2 border-t-8 transform rotate-90 -translate-y-1/2 size-0 border-x-8 border-x-transparent" />
      </div>
    </div>
  );
};
