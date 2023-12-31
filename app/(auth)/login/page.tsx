import dynamic from "next/dynamic"

const UserAuthForm = dynamic(
  async () => await import("@/components/user-auth-form"),
  { ssr: false }
)

export default function LoginPage() {
  return (
    <div className="container mt-40 flex flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-bold">To continue use your wallet</h1>
          <p className="text-sm text-slate-600 dark:text-slate-200">
            Connect with your Solana wallet and sign the transaction to verify
            wallet ownership.
          </p>
        </div>
        <UserAuthForm />
      </div>
    </div>
  )
}
