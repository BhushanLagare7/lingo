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
import { useExitModal } from "@/store/use-exit-modal";

export const ExitModal = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { close, isOpen } = useExitModal();

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
              alt="Mascot Sad"
              height={80}
              src="/mascot_sad.svg"
              width={80}
            />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Wait don&apos;t go!
          </DialogTitle>
          <DialogDescription className="text-base text-center">
            You&apos;re about to leave the lesson. Are you sure?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex flex-col gap-y-4 w-full">
            <Button
              className="w-full"
              size="lg"
              variant="primary"
              onClick={close}
            >
              Keep learning
            </Button>
            <Button
              className="w-full"
              size="lg"
              variant="danger-outline"
              onClick={() => {
                close();
                router.push("learn");
              }}
            >
              End session
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
