
import SignOutButton from "@/components/sign-out-button";

export default function ProtectedPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          This is protected part of the app for only logged in.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          To get here user must use wallet.
        </p>
      </div>
      <div className="flex gap-4">
        <SignOutButton>
          Sign out
        </SignOutButton>
      </div>
    </section>
  )
}
