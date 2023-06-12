import { env } from "@/env.mjs"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { Transaction } from "@solana/web3.js"
import { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        signedTransactionSerialized: {
          label: "SignedTransactionSerialized",
          type: "text",
          placeholder: "0x0",
        },
        pubkey: { label: "Pubkey", type: "text", placeholder: "0x0" },
      },
      async authorize(credentials, req) {
        try {
          const signedTransactionSerialized =
            credentials?.signedTransactionSerialized
          const pubkey = credentials?.pubkey
          const nonce = req.body?.csrfToken

          if (!(signedTransactionSerialized && pubkey && nonce)) {
            throw new Error("Missing required credentials.")
          }

          const transaction = Transaction.from(
            Buffer.from(signedTransactionSerialized, "hex")
          )

          if (!transaction.verifySignatures()) {
            throw new Error("Incorrect signature.")
          }

          const txNonce = transaction.instructions[0].data.toString()
          if (txNonce !== nonce) {
            throw new Error("Invalid nonce.")
          }

          const user = await db.user.upsert({
            where: {
              pubkey,
            },
            update: {},
            create: { pubkey },
          })

          return user
        } catch (e) {
          console.error(e)
          throw new Error("Failed to login user.")
        }
      },
    }),
  ],
  callbacks: {
    // Create session from token. Used for security narrow down
    // what data is available in the session.
    async session({ token, session }) {
      session.user.id = token.id
      session.user.pubkey = token.pubkey
      session.user.name = token.name
      session.user.imageUrl = token.imageUrl

      return session
    },
    // Used whenever the JWT token is created and updated.
    async jwt({ token, user, session, trigger }) {
      if (user) {
        token.id = user.id
        const dbUser = await db.user.findFirst({
          where: {
            id: user.id,
          },
          select: {
            pubkey: true,
            name: true,
            imageUrl: true,
          },
        })
        if (dbUser) {
          token.pubkey = dbUser.pubkey
          token.name = dbUser.name
          token.imageUrl = dbUser.imageUrl
        }
      }

      if (trigger === "update" && session?.user?.name) {
        token.name = session.user.name
      }

      return token
    },
  },
}
