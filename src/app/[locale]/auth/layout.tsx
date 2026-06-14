import { AuthToolbar } from '@/components/auth/auth-toolbar';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-br from-slate-100 via-background to-blue-50/40 dark:from-slate-950 dark:via-background dark:to-blue-950/20">
      <AuthToolbar />
      <main className="flex flex-1 items-center justify-center overflow-y-auto p-4 py-6 sm:py-8">
        <div className="w-full max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
