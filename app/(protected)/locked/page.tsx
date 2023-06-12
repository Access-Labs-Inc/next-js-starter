import { PublicKey } from "@solana/web3.js";

import { hasValidSubscriptionForPool } from "@/lib/acs";
import { env } from "@/env.mjs";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import SignOutButton from "@/components/sign-out-button";

export default async function LockedPage() {
  const poolPubkey = new PublicKey(env.NEXT_PUBLIC_POOL_ID);
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  const pubkey = new PublicKey(user.pubkey);
  const isSubscriber = await hasValidSubscriptionForPool(poolPubkey, pubkey);

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        {isSubscriber && (
          <>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              This is protected part of the app for only for subscribers to your pool.
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              To get here user must use wallet and has valid subscription.
            </p>
          </>
      )}
      {!isSubscriber && (
        <>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Sorry you're not subscriber!!
          </h1>
        </>
      )}
      </div>
      <div className="flex gap-4">
        <SignOutButton>
          Sign out
        </SignOutButton>
      </div>
    </section>
  )
}

