'use client';

import { useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface SignOutButtonProps {
  children?: React.ReactNode;
}

export default function SignOutButton({ children }: SignOutButtonProps) {
  const { disconnect } = useWallet();
  const handleSignout = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await disconnect();
    await signOut({
      callbackUrl: `${window.location.origin}/`,
    });
  }, [signOut, disconnect]);

  return (
    <Button onClick={handleSignout}>
      {children}
    </Button>
  )
}
