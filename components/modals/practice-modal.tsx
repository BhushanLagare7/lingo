"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePracticeModal } from "@/store/use-practice-modal";

export const PracticeModal = () => {
  const [mounted, setMounted] = useState(false);
  const { close, isOpen } = usePracticeModal();

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
            <Image alt="Hearts" height={100} src="/heart.svg" width={100} />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Practice Lesson
          </DialogTitle>
          <DialogDescription className="text-base text-center">
            Use practice lessons to regain your hearts and points. You cannot
            loose hearts or points in practice lessons.
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
              I understand
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
