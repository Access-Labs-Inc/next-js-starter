"use client";

import {
  HTMLAttributes,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSearchParams } from "next/navigation";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { getCsrfToken, signIn } from "next-auth/react";

import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sleep } from "@accessprotocol/js";

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>;

export default function UserAuthForm({
  className,
  ...props
}: UserAuthFormProps) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { connection } = useConnection();
  const {
    publicKey,
    connect,
    connected,
    connecting,
    wallets,
    wallet,
    signTransaction,
  } = useWallet();
  const { visible, setVisible } = useWalletModal();
  const { toast } = useToast();

  const walletDetected: boolean = useMemo(() => {
    return wallets.some((_wallet) => {
      return (
        _wallet.adapter.name !== "Torus" &&
        _wallet.readyState === WalletReadyState.Installed
      );
    });
  }, [wallets]);

  const handleModalClick: MouseEventHandler<HTMLButtonElement> =
    useCallback(() => {
      setError(null);
      setIsLoading(false);

      setVisible(!visible);
    }, [visible, setVisible]);

  const handleWalletConnectClick: MouseEventHandler<HTMLButtonElement> =
    useCallback(() => {
      setError(null);

      connect().catch(() => {
        setError("Failed to connect to wallet");
        setIsLoading(false);
      });
    }, [connect]);

  useEffect(() => {
    if (!(publicKey && signTransaction && connected) || error) return;
    (async () => {
      try {
        setIsLoading(true);
        const nonce = await getCsrfToken();

        if (!nonce) {
          throw new Error("Missing nonce.");
        }

        const tx = new Transaction();
        tx.add(
          new TransactionInstruction({
            programId: new PublicKey(
              "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
            ),
            keys: [{ pubkey: publicKey, isSigner: true, isWritable: false }],
            data: Buffer.from(nonce, "utf8"),
          })
        );

        const blockHash = await connection.getLatestBlockhash("finalized");

        tx.feePayer = publicKey;
        tx.recentBlockhash = blockHash.blockhash;

        const signedTransaction = await signTransaction(tx);
        const signedTransactionSerialized = signedTransaction
          .serialize({ requireAllSignatures: false })
          .toString("hex");

        await signIn("credentials", {
          signedTransactionSerialized: signedTransactionSerialized,
          pubkey: bs58.encode(publicKey.toBytes()),
          redirect: true,
          callbackUrl: searchParams?.get("from") ?? "/dashboard/settings",
        });
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          console.error(error);
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.message || "Failed to sign transaction",
          });
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [publicKey, searchParams, signTransaction, connection, connected, error]);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Button
        onClick={
          walletDetected && wallet ? handleWalletConnectClick : handleModalClick
        }
        disabled={isLoading || visible || connecting}
      >
        {(connecting || isLoading) && <Loading />}
        {!connecting && !isLoading && (
          <>
            <Icons.wallet className="mr-2" />
            Connect
          </>
        )}
      </Button>
    </div>
  );
}
