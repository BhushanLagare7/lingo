"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHeartsModal } from "@/store/use-hearts-modal";

export const HeartsModal = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { close, isOpen } = useHeartsModal();

  const onClick = () => {
    close();
    router.push("/store");
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex justify-center items-center mb-5 w-full">
            <Image
              alt="Mascot Bad"
              height={80}
              src="/mascot_bad.svg"
              width={80}
            />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            You ran out of hearts!
          </DialogTitle>
          <DialogDescription className="text-base text-center">
            Get Pro for unlimited hearts, or purchase them in the store.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex flex-col gap-y-4 w-full">
            <Button
              className="w-full"
              size="lg"
              variant="primary"
              onClick={onClick}
            >
              Get Unlimited Hearts
            </Button>
            <Button
              className="w-full"
              size="lg"
              variant="primary-outline"
              onClick={close}
            >
              No Thanks
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
