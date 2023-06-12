"use client"

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare"
import { TorusWalletAdapter } from "@solana/wallet-adapter-torus"

import "@solana/wallet-adapter-react-ui/styles.css"
import { env } from "@/env.mjs"

interface WalletConnectWrapperProps {
  children: React.ReactNode
}

export function WalletConnectProvider({ children }: WalletConnectWrapperProps) {
  const network = env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork
  const endpoint = env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT
  const wallets = [
    new PhantomWalletAdapter(),
    new TorusWalletAdapter({ params: { network } }),
    new SolflareWalletAdapter({ network }),
  ]
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
