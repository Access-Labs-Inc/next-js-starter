import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"), // Node environment
    NEXTAUTH_SECRET: z.string(),
    NEXT_PUBLIC_POOL_ID: z.string().min(1), // your pool ID
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get typeerrors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"), // Node environment
    NEXT_PUBLIC_ACCESS_PROGRAM_ID: z.string().min(1), // contract pubkey
    NEXT_PUBLIC_SOLANA_RPC_ENDPOINT: z.string().url().min(1), // solana rpc url
    NEXT_PUBLIC_SOLANA_NETWORK: z
      .nativeEnum(WalletAdapterNetwork)
      .default(WalletAdapterNetwork.Devnet), // solana network
    NEXT_PUBLIC_POOL_ID: z.string().min(1), // your pool ID
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get typeerrors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    // Next.js
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    // Solana
    NEXT_PUBLIC_ACCESS_PROGRAM_ID: process.env.NEXT_PUBLIC_ACCESS_PROGRAM_ID,
    NEXT_PUBLIC_SOLANA_RPC_ENDPOINT:
      process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT,
    NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK,
    NEXT_PUBLIC_POOL_ID: process.env.NEXT_PUBLIC_POOL_ID,
    // Next Auth
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
});
