import Image from "next/image";

import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="hidden p-2 w-full h-20 border-t-2 lg:block border-slate-200">
      <div className="flex justify-evenly items-center mx-auto max-w-5xl h-full">
        <Button className="flex-1" size="lg" variant="ghost">
          <Image
            alt="Croatian"
            className="mr-4 rounded-md"
            height={32}
            src="/hr.svg"
            width={40}
          />
          Croatian
        </Button>
        <Button className="flex-1" size="lg" variant="ghost">
          <Image
            alt="Spanish"
            className="mr-4 rounded-md"
            height={32}
            src="/es.svg"
            width={40}
          />
          Spanish
        </Button>
        <Button className="flex-1" size="lg" variant="ghost">
          <Image
            alt="French"
            className="mr-4 rounded-md"
            height={32}
            src="/fr.svg"
            width={40}
          />
          French
        </Button>
        <Button className="flex-1" size="lg" variant="ghost">
          <Image
            alt="Italian"
            className="mr-4 rounded-md"
            height={32}
            src="/it.svg"
            width={40}
          />
          Italian
        </Button>
        <Button className="flex-1" size="lg" variant="ghost">
          <Image
            alt="Japanese"
            className="mr-4 rounded-md"
            height={32}
            src="/jp.svg"
            width={40}
          />
          Japanese
        </Button>
      </div>
    </footer>
  );
};
