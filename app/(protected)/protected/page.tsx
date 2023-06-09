'use client';

import { useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function ProtectedPage() {
  const { disconnect } = useWallet();
  const handleSignout = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await disconnect();
    await signOut({
      callbackUrl: `${window.location.origin}/`,
    });
  }, [signOut, disconnect]);

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          This is protected part of the app.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          To get here user must use wallet.
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={handleSignout}>
          Sign out
        </Button>
      </div>
    </section>
  )
}
