import {
  hasValidSubscriptionForPool,
} from "@accessprotocol/js"
import { Connection, PublicKey } from "@solana/web3.js"

import { env } from "../env.mjs"

const endpoint = env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT
const programId = env.NEXT_PUBLIC_ACCESS_PROGRAM_ID

export const hasValidSubscription = async (
  poolPubkey: PublicKey,
  pubkey: PublicKey
): Promise<Boolean> => {
  const connection = new Connection(endpoint, { commitment: "confirmed" })
  const programPubkey = new PublicKey(programId)

  return hasValidSubscriptionForPool(connection, programPubkey, poolPubkey, pubkey)
}
