import Link from "next/link";

import Logo from "@/components/svg/Logo";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen overflow-hidden pt-16   p-12 rounded-lg">
      <div className="mx-auto flex w-full max-w-2xl flex-col sm:px-6">
        <Link href="/" aria-label="Home">
          <Logo className="mx-auto h-10 w-auto" />
        </Link>
        <div className="relative mt-5 sm:mt-5">
          <h1 className="text-center text-2xl font-medium tracking-tight ">
            {title}
          </h1>
          {subtitle && <p className="mt-3 text-center text-lg ">{subtitle}</p>}
        </div>
        <div className="mx-4 mt-10 flex-auto px-4 py-10  p-24 rounded-2xl">
          {children}
        </div>
      </div>
    </main>
  );
}
