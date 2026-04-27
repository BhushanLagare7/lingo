import Link from "next/link";

import { NotebookTextIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  description: string;
}

export const UnitBanner = ({ title, description }: Props) => {
  return (
    <div className="flex justify-between items-center p-5 w-full text-white bg-green-500 rounded-xl">
      <div className="space-y-2.5">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-lg">{description}</p>
      </div>
      <Link href="/lesson">
        <Button
          className="hidden border-2 border-b-4 xl:flex active:border-b-2"
          size="lg"
          variant="secondary"
        >
          <NotebookTextIcon className="mr-2" />
          Continue
        </Button>
      </Link>
    </div>
  );
};
