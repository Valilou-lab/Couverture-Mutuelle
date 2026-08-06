"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  MONTHLY_BUDGET_MAX,
  MONTHLY_BUDGET_MIN,
  MUTUAL_TENURES,
  PROTECTION_LEVELS,
  useQuoteJourney,
  type MutualTenureId,
  type ProtectionIconId,
  type ProtectionLevelId,
} from "@/context/QuoteJourneyContext";
import {
  formatBirthDateInput,
  isValidBirthDate,
} from "@/components/form/validation";
import {
  estimateSavings,
  deriveAgeFromBirthDate,
  isSeniorEligibleBirthDate,
  MIN_SENIOR_AGE,
  type SavingsProtectionLevelId,
  type SavingsTenureId,
} from "@/lib/savings-engine";
import { CalculatorLocationFields } from "@/components/landing/CalculatorLocationFields";

const ANALYSIS_STEPS = [
  "Analyse de votre profil…",
  "Recherche d’offres adaptées…",
  "Comparaison des niveaux de garanties…",
  "Estimation de votre économie…",
] as const;

/** Total analyzing time before showing the result (1.5–2s). */
const ANALYSIS_DURATION_MS = 1800;
const ANALYSIS_STEP_MS = Math.floor(
  ANALYSIS_DURATION_MS / ANALYSIS_STEPS.length,
);

/** Vert croissant : Essentiel (très clair) → Sérénité + (plus soutenu). */
const PROTECTION_GREEN_TONES = [
  {
    idle: "border-emerald-100 bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7]",
    hover:
      "hover:-translate-y-0.5 hover:border-emerald-300 hover:from-[#dcfce7] hover:to-[#bbf7d0] hover:shadow-[0_10px_24px_-12px_rgba(16,185,129,0.55)]",
    selected:
      "border-emerald-300 bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0] shadow-md ring-2 ring-emerald-200/70",
    icon: "bg-emerald-50 text-emerald-500",
    iconSelected: "bg-emerald-500 text-white",
    title: "text-emerald-800",
    titleSelected: "text-emerald-900",
    textSelected: "text-emerald-800/80",
    check: "bg-emerald-500",
  },
  {
    idle: "border-emerald-200 bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0]",
    hover:
      "hover:-translate-y-0.5 hover:border-emerald-400 hover:from-[#bbf7d0] hover:to-[#86efac] hover:shadow-[0_10px_24px_-12px_rgba(16,185,129,0.6)]",
    selected:
      "border-emerald-400 bg-gradient-to-br from-[#bbf7d0] to-[#86efac] shadow-md ring-2 ring-emerald-300/70",
    icon: "bg-emerald-100 text-emerald-600",
    iconSelected: "bg-emerald-600 text-white",
    title: "text-emerald-900",
    titleSelected: "text-emerald-950",
    textSelected: "text-emerald-900/80",
    check: "bg-emerald-600",
  },
  {
    idle: "border-emerald-300 bg-gradient-to-br from-[#bbf7d0] to-[#86efac]",
    hover:
      "hover:-translate-y-0.5 hover:border-emerald-500 hover:from-[#86efac] hover:to-[#4ade80] hover:shadow-[0_12px_28px_-12px_rgba(5,150,105,0.65)]",
    selected:
      "border-emerald-500 bg-gradient-to-br from-[#86efac] to-[#4ade80] shadow-md ring-2 ring-emerald-400/60",
    icon: "bg-emerald-200 text-emerald-700",
    iconSelected: "bg-emerald-700 text-white",
    title: "text-emerald-950",
    titleSelected: "text-emerald-950",
    textSelected: "text-emerald-950/85",
    check: "bg-emerald-700",
  },
  {
    idle: "border-emerald-400 bg-gradient-to-br from-[#86efac] to-[#4ade80]",
    hover:
      "hover:-translate-y-0.5 hover:border-emerald-600 hover:from-[#4ade80] hover:to-[#22c55e] hover:shadow-[0_14px_30px_-12px_rgba(21,128,61,0.7)]",
    selected:
      "border-emerald-600 bg-gradient-to-br from-[#4ade80] to-[#22c55e] shadow-md ring-2 ring-emerald-500/50",
    icon: "bg-emerald-500 text-white",
    iconSelected: "bg-emerald-800 text-white",
    title: "text-emerald-950",
    titleSelected: "text-white",
    textSelected: "text-emerald-50",
    check: "bg-emerald-800",
  },
] as const;

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7.25" />
      <path d="M10 6.5V10l2.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3.5" y="2.5" width="13" height="15" rx="2" />
      <rect x="6" y="5" width="8" height="3" rx="0.8" />
      <path
        d="M7 11h.01M10 11h.01M13 11h.01M7 14h.01M10 14h.01M13 14h.01"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        d="M3.5 13.5 8 9l3 3 5.5-5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12.5 6.5H16.5V10.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M16.5 8A6.5 6.5 0 1 0 15 14.8" strokeLinecap="round" />
      <path d="M16.5 4.5V8H13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckBadge() {
  return (
    <span
      className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white shadow-sm"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 16 16"
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      >
        <path
          d="M3.5 8.5 6.5 11.5 12.5 4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function ProtectionIcon({ id }: { id: ProtectionIconId }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-5 w-5 sm:h-6 sm:w-6",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (id === "shield") {
    return (
      <svg {...common}>
        <path d="M12 3 5 6v5c0 4.5 2.8 7.8 7 9 4.2-1.2 7-4.5 7-9V6l-7-3Z" />
      </svg>
    );
  }

  if (id === "heart") {
    return (
      <svg {...common}>
        <path d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 8.2a3.8 3.8 0 0 1 7 2.6C19 15.6 12 20 12 20Z" />
      </svg>
    );
  }

  if (id === "star") {
    return (
      <svg {...common}>
        <path d="m12 3.5 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 18.4l.9-5.4-3.9-3.8 5.4-.8L12 3.5Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M5 9.5h14l-1.2 1.8a4 4 0 0 1-3.3 1.7H9.5a4 4 0 0 1-3.3-1.7L5 9.5Z" />
      <path d="M8 9.5 10.2 5l1.8 2.5L14 4.5 16 9.5" />
      <path d="M8.5 13v5.5h7V13" />
    </svg>
  );
}

function AnalysisCheckIcon() {
  return (
    <span
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-sm"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      >
        <path
          d="M3.5 8.5 6.5 11.5 12.5 4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function CalculatorAnalyzing({ visibleCount }: { visibleCount: number }) {
  const progress = Math.min(
    100,
    Math.round((visibleCount / ANALYSIS_STEPS.length) * 100),
  );

  return (
    <div className="py-6 text-center sm:py-8" aria-live="polite" aria-busy="true">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
      <h3 className="font-manrope text-xl font-bold tracking-tight text-[#3b0764] sm:text-2xl">
        Calcul en cours
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">
        Nous préparons une estimation indicative adaptée à votre profil.
      </p>

      <ul className="mx-auto mt-7 max-w-md space-y-3 text-left">
        {ANALYSIS_STEPS.map((label, index) => {
          const visible = index < visibleCount;
          return (
            <li
              key={label}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-300 ${
                visible
                  ? "translate-y-0 border-brand/25 bg-brand-soft/60 opacity-100"
                  : "translate-y-1 border-transparent bg-transparent opacity-0"
              }`}
            >
              {visible ? (
                <AnalysisCheckIcon />
              ) : (
                <span className="h-6 w-6 shrink-0" aria-hidden="true" />
              )}
              <span
                className={`text-sm font-medium sm:text-base ${
                  visible ? "text-[#3b0764]" : "text-zinc-400"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mx-auto mt-8 h-2 max-w-sm overflow-hidden rounded-full bg-brand-soft">
        <div
          className="h-full rounded-full bg-brand transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function TenureChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative min-h-11 rounded-full border-2 px-4 pr-5 text-sm font-semibold transition duration-200 ${
        selected
          ? "calc-chip-selected border-brand bg-brand-soft text-brand shadow-sm"
          : "border-border bg-white text-foreground hover:border-brand hover:bg-brand-soft/60 hover:text-brand"
      }`}
    >
      {selected ? <CheckBadge /> : null}
      {children}
    </button>
  );
}

export function SavingsCalculator() {
  const {
    calculator,
    setCalculator,
    isCalculatorComplete,
    estimate,
    setEstimateFromEngine,
    clearEstimate,
    requestSavingsQuoteFocus,
  } = useQuoteJourney();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisVisibleCount, setAnalysisVisibleCount] = useState(0);
  const [birthTouched, setBirthTouched] = useState(false);
  const [budgetTouched, setBudgetTouched] = useState(false);

  const showResult = Boolean(estimate) && !isLoading;

  const birthError = useMemo(() => {
    if (!birthTouched) return null;
    if (!calculator.birthDate) return null;
    if (calculator.birthDate.length < 10) {
      return calculator.birthDate.length >= 8
        ? "Format attendu : JJ/MM/AAAA"
        : null;
    }
    if (!isValidBirthDate(calculator.birthDate)) {
      return "Date invalide ou future.";
    }
    const age = deriveAgeFromBirthDate(calculator.birthDate);
    if (age !== null && age < MIN_SENIOR_AGE) {
      return `Ce calculateur s’adresse aux personnes de ${MIN_SENIOR_AGE} ans et plus.`;
    }
    if (!isSeniorEligibleBirthDate(calculator.birthDate)) {
      return "Date invalide ou future.";
    }
    return null;
  }, [birthTouched, calculator.birthDate]);

  const budgetError = useMemo(() => {
    if (!budgetTouched || !calculator.monthlyBudget) return null;
    const amount = Number(calculator.monthlyBudget);
    if (!Number.isFinite(amount)) return "Indiquez un montant valide.";
    if (amount < MONTHLY_BUDGET_MIN) {
      return `Minimum ${MONTHLY_BUDGET_MIN} €.`;
    }
    if (amount > MONTHLY_BUDGET_MAX) {
      return `Maximum ${MONTHLY_BUDGET_MAX} €.`;
    }
    return null;
  }, [budgetTouched, calculator.monthlyBudget]);

  const canCalculate = isCalculatorComplete && !isLoading;

  function handleBirthDateChange(raw: string) {
    setCalculator({ birthDate: formatBirthDateInput(raw) });
  }

  function handleMonthlyBudget(raw: string) {
    const cleaned = raw.replace(/[^\d]/g, "").slice(0, 3);
    setCalculator({ monthlyBudget: cleaned });
  }

  function handleCalculate() {
    if (!canCalculate) return;
    if (!calculator.mutualTenure || !calculator.protectionLevel) return;

    setAnalysisVisibleCount(0);
    setIsLoading(true);
  }

  useEffect(() => {
    if (!isLoading) return;
    if (!calculator.mutualTenure || !calculator.protectionLevel) return;

    setAnalysisVisibleCount(1);

    const timers: number[] = [];
    for (let index = 2; index <= ANALYSIS_STEPS.length; index += 1) {
      timers.push(
        window.setTimeout(() => {
          setAnalysisVisibleCount(index);
        }, ANALYSIS_STEP_MS * (index - 1)),
      );
    }

    timers.push(
      window.setTimeout(() => {
        const nextEstimate = estimateSavings({
          birthDate: calculator.birthDate,
          monthlyPremium: Number(calculator.monthlyBudget),
          tenure: calculator.mutualTenure as SavingsTenureId,
          protectionLevel:
            calculator.protectionLevel as SavingsProtectionLevelId,
        });
        setEstimateFromEngine(nextEstimate);
        setIsLoading(false);
        setAnalysisVisibleCount(0);
      }, ANALYSIS_DURATION_MS),
    );

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [
    calculator.birthDate,
    calculator.monthlyBudget,
    calculator.mutualTenure,
    calculator.protectionLevel,
    isLoading,
    setEstimateFromEngine,
  ]);

  function handleReset() {
    clearEstimate();
    setIsLoading(false);
    setAnalysisVisibleCount(0);
  }

  function goToQuoteForm() {
    requestSavingsQuoteFocus();
    document
      .getElementById("savings-devis")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="calculateur-economies"
      className="scroll-mt-24 bg-surface px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand/25 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand sm:text-sm">
            <ClockIcon />
            60 secondes chrono — sans inscription
          </p>
          <h2 className="mt-4 font-manrope text-2xl font-bold tracking-tight text-[#3b0764] sm:text-3xl lg:text-[2.1rem] lg:leading-tight">
            Estimez votre économie potentielle
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 sm:text-base">
            Répondez à quelques questions simples et découvrez immédiatement
            votre économie potentielle.
          </p>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_18px_40px_-24px_rgba(76,29,149,0.35)] sm:p-7 lg:p-8">
          {isLoading ? (
            <CalculatorAnalyzing visibleCount={analysisVisibleCount} />
          ) : !showResult ? (
            <div className="space-y-7">
              <div>
                <label
                  htmlFor="calculator-birthDate"
                  className="block font-manrope text-base font-semibold text-[#3b0764] sm:text-lg"
                >
                  1. Quelle est votre date de naissance&nbsp;?
                </label>
                <input
                  id="calculator-birthDate"
                  inputMode="numeric"
                  autoComplete="bday"
                  placeholder="14/06/1956"
                  maxLength={10}
                  value={calculator.birthDate}
                  onChange={(event) =>
                    handleBirthDateChange(event.target.value)
                  }
                  onBlur={() => setBirthTouched(true)}
                  aria-invalid={Boolean(birthError)}
                  aria-describedby={
                    birthError ? "calculator-birthDate-error" : undefined
                  }
                  className={`mt-3 min-h-14 w-full rounded-2xl border bg-white px-4 py-3.5 text-base text-foreground outline-none ring-brand/30 placeholder:text-brand-muted focus:ring-2 ${
                    birthError ? "border-error/50" : "border-border"
                  }`}
                />
                {birthError ? (
                  <p
                    id="calculator-birthDate-error"
                    className="mt-2 text-xs text-error"
                    role="alert"
                  >
                    {birthError}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-zinc-500">
                    Format&nbsp;: JJ/MM/AAAA
                  </p>
                )}
              </div>

              <CalculatorLocationFields questionNumber={2} />

              <div>
                <label
                  htmlFor="calculator-monthlyBudget"
                  className="block font-manrope text-base font-semibold text-[#3b0764] sm:text-lg"
                >
                  3. Combien payez-vous aujourd’hui par mois&nbsp;?
                </label>
                <div className="relative mt-3">
                  <input
                    id="calculator-monthlyBudget"
                    inputMode="numeric"
                    placeholder="Ex. 95"
                    value={calculator.monthlyBudget}
                    onChange={(event) =>
                      handleMonthlyBudget(event.target.value)
                    }
                    onBlur={() => setBudgetTouched(true)}
                    aria-invalid={Boolean(budgetError)}
                    aria-describedby={
                      budgetError ? "calculator-budget-error" : undefined
                    }
                    className={`min-h-14 w-full rounded-2xl border bg-white px-4 py-3.5 pr-12 text-base text-foreground outline-none ring-brand/30 placeholder:text-brand-muted focus:ring-2 ${
                      budgetError ? "border-error/50" : "border-border"
                    }`}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-base font-semibold text-brand">
                    €
                  </span>
                </div>
                {budgetError ? (
                  <p
                    id="calculator-budget-error"
                    className="mt-2 text-xs text-error"
                    role="alert"
                  >
                    {budgetError}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-zinc-500">
                    Entre {MONTHLY_BUDGET_MIN}&nbsp;€ et {MONTHLY_BUDGET_MAX}
                    &nbsp;€
                  </p>
                )}
              </div>

              <div>
                <p className="font-manrope text-base font-semibold text-[#3b0764] sm:text-lg">
                  4. Depuis combien de temps êtes-vous chez votre mutuelle
                  actuelle&nbsp;?
                </p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {MUTUAL_TENURES.map((item) => (
                    <TenureChip
                      key={item.id}
                      selected={calculator.mutualTenure === item.id}
                      onClick={() =>
                        setCalculator({
                          mutualTenure: item.id as MutualTenureId,
                        })
                      }
                    >
                      {item.label}
                    </TenureChip>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-manrope text-base font-semibold text-[#3b0764] sm:text-lg">
                  5. Quel niveau de protection recherchez-vous&nbsp;?
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-2.5">
                  {PROTECTION_LEVELS.map((item, index) => {
                    const selected =
                      calculator.protectionLevel === item.id;
                    const tone = PROTECTION_GREEN_TONES[index] ?? PROTECTION_GREEN_TONES[0];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          setCalculator({
                            protectionLevel: item.id as ProtectionLevelId,
                          })
                        }
                        className={`relative rounded-2xl border-2 px-3 py-2.5 text-left transition duration-200 sm:px-4 sm:py-3.5 ${
                          selected
                            ? `calc-chip-selected ${tone.selected}`
                            : `${tone.idle} ${tone.hover}`
                        }`}
                      >
                        {selected ? (
                          <span
                            className={`absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-white shadow-sm ${tone.check}`}
                            aria-hidden="true"
                          >
                            <svg
                              viewBox="0 0 16 16"
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.4"
                            >
                              <path
                                d="M3.5 8.5 6.5 11.5 12.5 4.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        ) : null}
                        <span className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                          <span
                            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${
                              selected ? tone.iconSelected : tone.icon
                            }`}
                          >
                            <ProtectionIcon id={item.icon} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block text-sm font-semibold sm:text-base ${
                                selected ? tone.titleSelected : tone.title
                              }`}
                            >
                              {item.label}
                            </span>
                            <span
                              className={`mt-0.5 block text-xs leading-snug sm:mt-1 sm:text-sm sm:leading-relaxed ${
                                selected ? tone.textSelected : "text-zinc-600"
                              }`}
                            >
                              <span className="line-clamp-2 sm:hidden">
                                {item.shortDescription}
                              </span>
                              <span className="hidden sm:inline">
                                {item.description}
                              </span>
                            </span>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                disabled={!canCalculate}
                onClick={handleCalculate}
                className="calc-btn-ready inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7c3aed] to-brand px-7 text-sm font-semibold text-white shadow-[0_12px_28px_-10px_rgba(109,40,217,0.55)] transition duration-200 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
              >
                <CalculatorIcon />
                Calculer mon économie
              </button>

              <p className="text-center text-xs leading-relaxed text-zinc-500">
                Estimation indicative, gratuite et sans engagement. Aucune
                donnée personnelle sensible n’est demandée ici.
              </p>
            </div>
          ) : estimate ? (
            <div className="text-center">
              <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3.5 py-1.5 text-xs font-semibold text-brand sm:text-sm">
                <TrendIcon />
                Votre estimation
              </p>

              <h3 className="mt-5 font-manrope text-xl font-bold tracking-tight text-[#3b0764] sm:text-2xl">
                {estimate.title}
              </h3>

              {estimate.yearlySavingsMin !== null &&
              estimate.yearlySavingsMax !== null ? (
                <>
                  <p className="mt-5 font-manrope text-3xl font-extrabold tracking-tight text-brand sm:text-4xl">
                    Entre {estimate.yearlySavingsMin}&nbsp;€ et{" "}
                    {estimate.yearlySavingsMax}&nbsp;€
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#3b0764] sm:text-base">
                    d’économie potentielle par an
                  </p>
                </>
              ) : null}

              <div className="mx-auto mt-4 max-w-lg space-y-3 text-sm leading-relaxed text-zinc-700 sm:text-base">
                {estimate.message.split("\n\n").map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {estimate.benefits.length > 0 ? (
                <ul className="mx-auto mt-6 max-w-lg space-y-2.5 rounded-[1.25rem] border border-brand/15 bg-brand-soft/40 px-4 py-4 text-left sm:px-5">
                  {estimate.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2.5 text-sm text-[#3b0764] sm:text-[0.95rem]"
                    >
                      <span
                        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white"
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 16 16"
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                        >
                          <path
                            d="M3.5 8.5 6.5 11.5 12.5 4.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {estimate.reasons.length > 0 ? (
                <ul className="mx-auto mt-5 max-w-lg space-y-2 text-left">
                  {estimate.reasons.map((reason) => (
                    <li
                      key={reason}
                      className="flex items-start gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-zinc-700 ring-1 ring-border"
                    >
                      <span className="mt-0.5 text-brand" aria-hidden="true">
                        •
                      </span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={goToQuoteForm}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#7c3aed] to-brand px-7 text-sm font-semibold text-white shadow-[0_12px_28px_-10px_rgba(109,40,217,0.55)] transition hover:brightness-105"
                >
                  {estimate.ctaLabel}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-border bg-white px-6 text-sm font-semibold text-foreground transition hover:border-brand hover:bg-brand-soft/60 hover:text-brand"
                >
                  <RefreshIcon />
                  Refaire le calcul
                </button>
              </div>

              <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-zinc-500">
                Vos informations de simulation sont conservées. Il ne vous reste
                plus qu’à compléter vos coordonnées pour recevoir vos
                propositions personnalisées.
              </p>

              <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-zinc-400">
                {estimate.disclaimer}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
