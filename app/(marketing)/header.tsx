import Image from "next/image";

import { LoaderIcon } from "lucide-react";
import {
  ClerkLoaded,
  ClerkLoading,
  Show,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="px-4 w-full h-20 border-b-2 border-slate-200">
      <div className="flex justify-between items-center mx-auto h-full lg:max-w-5xl">
        <div className="flex gap-x-3 items-center pt-8 pb-7 pl-4">
          <Image alt="Mascot" height={40} src="/mascot.svg" width={40} />
          <h1 className="text-2xl font-extrabold tracking-wide text-green-600">
            Lingo
          </h1>
        </div>
        <ClerkLoading>
          <LoaderIcon className="animate-spin size-5 text-muted-foreground" />
        </ClerkLoading>
        <ClerkLoaded>
          <Show when="signed-out">
            <SignInButton
              forceRedirectUrl="/learn"
              mode="modal"
              signUpForceRedirectUrl="/learn"
            >
              <Button size="lg" variant="ghost">
                Login
              </Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </ClerkLoaded>
      </div>
    </header>
  );
};
