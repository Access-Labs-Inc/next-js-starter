import { WalletConnectProvider } from "@/app/wallet-connect-provider";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen">
      <WalletConnectProvider>{children}</WalletConnectProvider>
    </div>
  );
}
