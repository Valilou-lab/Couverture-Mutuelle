import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { StepConfirmation } from "@/components/form/StepConfirmation";

export const metadata: Metadata = {
  title: "Confirmation — Couverture Mutuelle",
  description:
    "Votre demande a bien été envoyée. Un conseiller Couverture Mutuelle va vous rappeler.",
};

/**
 * Neutral confirmation URL for Meta Custom Conversion (page visit).
 * No PII, no form data, no lead id, no query string.
 * Does not push lead_completed — that stays only in QuoteForm after backend success.
 */
export default function ConfirmationPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-b from-brand-soft/80 via-[#f5f2ff] to-white">
        <div className="relative mx-auto w-full max-w-xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(196,181,253,0.45),transparent_65%)]" />
          <div className="relative rounded-[1.75rem] border-2 border-brand/40 bg-white p-3.5 pb-4 sm:p-5 sm:pb-5 lg:p-8">
            <StepConfirmation />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
