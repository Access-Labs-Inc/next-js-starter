import { type DefaultSession } from "next-auth"

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    pubkey: string
    name: string | null
    imageUrl: string | null
  }
}

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string
      pubkey: string
      name: string | null
      imageUrl: string | null
    }
  }
}
