import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const Promo = () => {
  return (
    <div className="p-4 space-y-4 rounded-xl border-2">
      <div className="space-y-2">
        <div className="flex gap-x-2 items-center">
          <Image alt="Pro" height={26} src="/unlimited.svg" width={26} />
          <h3 className="text-lg font-bold">Upgrade to Pro</h3>
        </div>
        <p className="text-muted-foreground">Get unlimited hearts and more!</p>
      </div>
      <Button asChild className="w-full" size="lg" variant="super">
        <Link href="/shop">Upgrade today</Link>
      </Button>
    </div>
  );
};
