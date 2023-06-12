import { StakePool, BondAccount, StakeAccount, getBondAccounts } from "@accessprotocol/js";
import { Connection, PublicKey } from "@solana/web3.js";
import BN from 'bn.js';

import { env } from "../env.mjs";

const endpoint = env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT;
const programId = env.NEXT_PUBLIC_ACCESS_PROGRAM_ID;

export const getLockedAmountForPool = async (poolPubkey: PublicKey, pubkey: PublicKey) : Promise<BN> => {
  const connection = new Connection(endpoint, { commitment: "confirmed" })
  const programPubkey = new PublicKey(programId);

  const [stakeKey] = await StakeAccount.getKey(
    programPubkey,
    pubkey,
    poolPubkey,
  );

  // SUM of locked tokens (aka Stake Account)
  let lockedAmount: BN = new BN(0);

  let stakeAccount: StakeAccount | undefined = undefined;
  try {
    stakeAccount = await StakeAccount.retrieve(connection, stakeKey);
    lockedAmount = lockedAmount.add(stakeAccount.stakeAmount);
  } catch (e) {
    console.error("Could not find lock account. Error: ", e);
  }

  // SUM of airdrop tokens (aka Bond Accounts)
  let bondsAmountSum = new BN(0);

  const allBondAccountsForUser = await getBondAccounts(connection, pubkey, programPubkey);
  if (allBondAccountsForUser != null && allBondAccountsForUser.length > 0) {
    allBondAccountsForUser.forEach((ba) => {
      const b = BondAccount.deserialize(ba.account.data);
      if (b.stakePool.toBase58() === poolPubkey.toBase58()) {
        bondsAmountSum = bondsAmountSum.add(b.totalStaked);
      }
    });
  }

  return lockedAmount.add(bondsAmountSum);
}

export const hasValidSubscriptionForPool = async (poolPubkey: PublicKey, pubkey: PublicKey) : Promise<Boolean> => {
  const connection = new Connection(endpoint, { commitment: "confirmed" })
  const programPubkey = new PublicKey(programId);

  let poolAccount: StakePool | undefined = undefined;
  try {
    poolAccount = await StakePool.retrieve(connection, poolPubkey);
  } catch (e) {
    console.error("Could not find stake pool account. Error: ", e)
    return false;
  }

  const [stakeKey] = await StakeAccount.getKey(
    programPubkey,
    pubkey,
    poolPubkey,
  );

  let stakeAccount: StakeAccount | undefined = undefined;
  try {
    stakeAccount = await StakeAccount.retrieve(connection, stakeKey);
  } catch (e) {
    console.error("Could not find lock account. Error: ", e);
  }

  const requiredMinAmountToLock = stakeAccount
    ? Math.min(
        Number(stakeAccount.poolMinimumAtCreation),
        Number(poolAccount.minimumStakeAmount)
      )
    : Number(poolAccount.minimumStakeAmount)

  const lockedAmount = await getLockedAmountForPool(poolPubkey, pubkey);
  console.log("Required lock: ", requiredMinAmountToLock);
  console.log("Locked amount: ", lockedAmount.toNumber());

  return lockedAmount.toNumber() >= requiredMinAmountToLock;
}
