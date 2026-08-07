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
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <Link href="/" className="text-sm font-semibold text-brand hover:underline">
          ← Retour à l’accueil
        </Link>
        <h1
          className={`mt-6 text-3xl font-semibold tracking-tight ${
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
