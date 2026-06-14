export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-background to-blue-50/40 p-4 dark:from-slate-950 dark:via-background dark:to-blue-950/20">
      {children}
    </div>
  );
}
