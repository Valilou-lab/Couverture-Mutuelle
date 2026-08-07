"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { SavingsQuoteForm } from "@/components/form/SavingsQuoteForm";
import { useQuoteJourney } from "@/context/QuoteJourneyContext";
import {
  isSavingsJourneyReady,
  loadSavingsJourneySnapshot,
} from "@/lib/savings-journey-storage";

export default function SavingsQuotePage() {
  const router = useRouter();
  const {
    calculator,
    estimate,
    setCalculator,
    restoreEstimateSnapshot,
    requestSavingsQuoteFocus,
  } = useQuoteJourney();
  const [ready, setReady] = useState(false);
  const booted = useRef(false);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    if (isSavingsJourneyReady({ calculator, estimate })) {
      requestSavingsQuoteFocus();
      setReady(true);
      return;
    }

    const stored = loadSavingsJourneySnapshot();
    if (!stored || !isSavingsJourneyReady(stored)) {
      router.replace("/#calculateur-economies");
      return;
    }

    setCalculator(stored.calculator);
    restoreEstimateSnapshot(stored.estimate);
    requestSavingsQuoteFocus();
    setReady(true);
  }, [
    calculator,
    estimate,
    requestSavingsQuoteFocus,
    restoreEstimateSnapshot,
    router,
    setCalculator,
  ]);

  if (!ready) {
    return (
      <>
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <p className="text-sm text-zinc-500">Chargement de votre devis…</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-b from-white via-[#f5f2ff] to-surface px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-xl lg:max-w-2xl">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.14em] text-brand">
            Devis personnalisés
          </p>
          <h1 className="mt-2 text-center font-manrope text-2xl font-bold tracking-tight text-[#3b0764] sm:text-3xl">
            Finalisez votre demande de devis
          </h1>
          <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-zinc-600 sm:text-base">
            Vos informations du calculateur sont déjà enregistrées. Il ne reste
            que quelques questions pour recevoir vos propositions.
          </p>
          <p className="mt-3 text-center text-sm">
            <Link
              href="/#calculateur-economies"
              className="font-medium text-brand underline-offset-2 hover:underline"
            >
              ← Retour au calculateur
            </Link>
          </p>
          <div className="relative z-10 mt-8 overflow-visible pb-14 sm:pb-16">
            <SavingsQuoteForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
