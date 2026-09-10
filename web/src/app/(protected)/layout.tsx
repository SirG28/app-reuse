import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ToastProvider } from "@/components/ToastProvider";
import { requireSession } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Checagem de sessão feita no servidor via Prisma (tabela Session) —
  // redireciona para /login se o cookie não corresponder a uma sessão válida.
  await requireSession();

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-reuse-bg">
        <SiteHeader logoutAction={logoutAction} />
        <div className="mx-auto w-full max-w-5xl flex-1">{children}</div>
        <SiteFooter />
      </div>
    </ToastProvider>
  );
}
