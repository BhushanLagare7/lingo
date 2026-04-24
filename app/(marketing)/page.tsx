import Image from "next/image";
import Link from "next/link";

import { LoaderIcon } from "lucide-react";
import {
  ClerkLoaded,
  ClerkLoading,
  Show,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <div className="max-w-249.5 mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2">
      <div className="relative mb-8 size-60 lg:size-106 lg:mb-0">
        <Image alt="Hero" fill src="/hero.svg" />
      </div>
      <div className="flex flex-col gap-y-8 items-center">
        <h1 className="text-xl font-bold text-center lg:text-3xl text-neutral-600 max-w-120">
          Learn, practice, and master new languages with Lingo.
        </h1>
        <div className="flex flex-col items-center gap-y-3 max-w-82.5 w-full">
          <ClerkLoading>
            <LoaderIcon className="animate-spin size-5 text-muted-foreground" />
          </ClerkLoading>
          <ClerkLoaded>
            <Show when="signed-out">
              <SignUpButton
                forceRedirectUrl="/learn"
                mode="modal"
                signInForceRedirectUrl="/learn"
              >
                <Button className="w-full" size="lg" variant="secondary">
                  Get Started
                </Button>
              </SignUpButton>
              <SignInButton
                forceRedirectUrl="/learn"
                mode="modal"
                signUpForceRedirectUrl="/learn"
              >
                <Button className="w-full" size="lg" variant="primary-outline">
                  I already have an account
                </Button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <Button asChild className="w-full" size="lg" variant="secondary">
                <Link href="/learn">Continue Learning</Link>
              </Button>
            </Show>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
