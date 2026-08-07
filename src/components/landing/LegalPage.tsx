import type { ReactNode } from "react";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

type LegalPageProps = {
  title: string;
  titleClassName?: string;
  children: ReactNode;
};

export function LegalPage({ title, titleClassName, children }: LegalPageProps) {
  return (
    <>
      <Header />
      <main className="relative mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/"
          aria-label="Fermer et retourner à l’accueil"
          className="absolute right-3 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition hover:bg-brand-soft hover:text-brand sm:right-4 sm:top-6"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </Link>

        <h1
          className={`pr-12 text-3xl font-semibold tracking-tight ${
            titleClassName ?? "text-foreground"
          }`}
        >
          {title}
        </h1>
        <div className="prose-muted mt-6 space-y-4 text-sm leading-relaxed text-zinc-600 sm:text-[15px] [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
