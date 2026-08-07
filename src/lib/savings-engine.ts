/**
 * Savings estimation engine — pure TypeScript, no React / JSX.
 *
 * Indicative estimate only (NOT a real quote).
 * Never promises a guaranteed saving.
 */

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type SavingsTenureId = "moins-2-ans" | "2-5-ans" | "plus-5-ans";

export type SavingsProtectionLevelId =
  | "essentiel"
  | "confort"
  | "premium"
  | "serenite-plus";

/** Internal only — never show a fake % to the user. */
export type SavingsConfidence = "low" | "medium" | "high";

export type SavingsResultType =
  | "estimatedSaving"
  | "lowPotential"
  | "competitive"
  | "invalid";

export type SavingsAgeBandId =
  | "55-59"
  | "60-64"
  | "65-69"
  | "70-74"
  | "75+"
  | "unknown";

export interface SavingsEngineInput {
  /** Format JJ/MM/AAAA */
  birthDate: string;
  monthlyPremium: number;
  tenure: SavingsTenureId;
  protectionLevel: SavingsProtectionLevelId;
}

export interface SavingsEngineResult {
  resultType: SavingsResultType;
  confidence: SavingsConfidence;
  title: string;
  message: string;
  ctaLabel: string;
  reasons: string[];
  /** Conversion benefits shown in the result card. */
  benefits: string[];
  /** Central yearly estimate (0 when no numbered saving). */
  yearlySavings: number;
  /** Displayed monthly saving derived from yearly (0 when none). */
  monthlySavings: number;
  estimatedMonthlyPremium: number;
  /** Range bounds for displayed potential savings (rounded to tens). */
  yearlySavingsMin: number | null;
  yearlySavingsMax: number | null;
  disclaimer: string;
}

export interface SavingsValidationResult {
  ok: boolean;
  errors: string[];
}

export interface SavingsProfile {
  age: number;
  ageBand: Exclude<SavingsAgeBandId, "unknown">;
  monthlyPremium: number;
  tenure: SavingsTenureId;
  protectionLevel: SavingsProtectionLevelId;
  referencePrice: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const COMPETITIVE_PREMIUM_THRESHOLD = 50;
export const PREMIUM_INPUT_MIN = 20;
export const PREMIUM_INPUT_MAX = 300;
/** Minimum age allowed to submit a quote / use the calculator. */
export const MIN_ELIGIBLE_AGE = 35;
/** Maximum age allowed to submit a quote / use the calculator. */
export const MAX_ELIGIBLE_AGE = 110;
/** Lowest age band in the savings reference grid. */
export const MIN_SENIOR_AGE = 55;
export const LOW_POTENTIAL_YEARLY_THRESHOLD = 60;
export const MAX_YEARLY_SAVING = 500;
export const MAX_SAVING_RATIO = 0.3;

const referencePrices = {
  "55-59": { essential: 50, comfort: 62, premium: 76, serenity: 92 },
  "60-64": { essential: 58, comfort: 72, premium: 88, serenity: 108 },
  "65-69": { essential: 70, comfort: 86, premium: 106, serenity: 130 },
  "70-74": { essential: 82, comfort: 102, premium: 126, serenity: 152 },
  "75+": { essential: 98, comfort: 122, premium: 150, serenity: 178 },
} as const;

const tenureMultiplier = {
  lessThan2: 1,
  twoToFive: 1.05,
  moreThan5: 1.1,
} as const;

export const SAVINGS_DISCLAIMER =
  "Estimation indicative basée sur une grille tarifaire moyenne. Le montant réel dépend notamment de votre département, de votre situation, des garanties choisies et des offres disponibles au moment de votre demande.";

const TENURE_IDS: readonly SavingsTenureId[] = [
  "moins-2-ans",
  "2-5-ans",
  "plus-5-ans",
];

const PROTECTION_IDS: readonly SavingsProtectionLevelId[] = [
  "essentiel",
  "confort",
  "premium",
  "serenite-plus",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function roundToTen(value: number): number {
  return Math.round(value / 10) * 10;
}

function parseBirthDate(birthDate: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(birthDate.trim());
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function deriveAgeFromBirthDate(
  birthDate: string,
  today: Date = new Date(),
): number | null {
  const date = parseBirthDate(birthDate);
  if (!date) return null;
  if (date > today) return null;

  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }

  if (age < 0 || age > 150) return null;
  return age;
}

export function isEligibleBirthDate(birthDate: string): boolean {
  const age = deriveAgeFromBirthDate(birthDate);
  return (
    age !== null && age >= MIN_ELIGIBLE_AGE && age <= MAX_ELIGIBLE_AGE
  );
}

/** @deprecated Prefer isEligibleBirthDate — kept for existing imports. */
export function isSeniorEligibleBirthDate(birthDate: string): boolean {
  return isEligibleBirthDate(birthDate);
}

export function resolveAgeBand(age: number | null): SavingsAgeBandId {
  if (age === null || age < MIN_ELIGIBLE_AGE || age > MAX_ELIGIBLE_AGE) {
    return "unknown";
  }
  // Under 55: use the nearest (lowest) reference band for indicative estimates.
  if (age < MIN_SENIOR_AGE) return "55-59";
  if (age <= 59) return "55-59";
  if (age <= 64) return "60-64";
  if (age <= 69) return "65-69";
  if (age <= 74) return "70-74";
  return "75+";
}

function mapProtectionKey(
  level: SavingsProtectionLevelId,
): keyof (typeof referencePrices)["55-59"] {
  switch (level) {
    case "essentiel":
      return "essential";
    case "confort":
      return "comfort";
    case "premium":
      return "premium";
    case "serenite-plus":
      return "serenity";
  }
}

function mapTenureKey(
  tenure: SavingsTenureId,
): keyof typeof tenureMultiplier {
  switch (tenure) {
    case "moins-2-ans":
      return "lessThan2";
    case "2-5-ans":
      return "twoToFive";
    case "plus-5-ans":
      return "moreThan5";
  }
}

export function getReferencePrice(
  ageBand: Exclude<SavingsAgeBandId, "unknown">,
  protectionLevel: SavingsProtectionLevelId,
): number {
  return referencePrices[ageBand][mapProtectionKey(protectionLevel)];
}

export function getTenureMultiplier(tenure: SavingsTenureId): number {
  return tenureMultiplier[mapTenureKey(tenure)];
}

// ---------------------------------------------------------------------------
// Validation & profile
// ---------------------------------------------------------------------------

export function validateSavingsInput(
  input: SavingsEngineInput,
): SavingsValidationResult {
  const errors: string[] = [];

  const age = deriveAgeFromBirthDate(input.birthDate);
  if (age === null) {
    errors.push("Date de naissance invalide ou future.");
  } else if (age < MIN_ELIGIBLE_AGE) {
    errors.push(`Vous devez avoir au moins ${MIN_ELIGIBLE_AGE} ans.`);
  } else if (age > MAX_ELIGIBLE_AGE) {
    errors.push(`L’âge maximum accepté est de ${MAX_ELIGIBLE_AGE} ans.`);
  }

  if (
    !Number.isFinite(input.monthlyPremium) ||
    input.monthlyPremium < PREMIUM_INPUT_MIN ||
    input.monthlyPremium > PREMIUM_INPUT_MAX
  ) {
    errors.push(
      `La cotisation doit être comprise entre ${PREMIUM_INPUT_MIN} € et ${PREMIUM_INPUT_MAX} €.`,
    );
  }

  if (!TENURE_IDS.includes(input.tenure)) {
    errors.push("Ancienneté invalide.");
  }

  if (!PROTECTION_IDS.includes(input.protectionLevel)) {
    errors.push("Niveau de protection invalide.");
  }

  return { ok: errors.length === 0, errors };
}

export function buildSavingsProfile(input: SavingsEngineInput): SavingsProfile {
  const age = deriveAgeFromBirthDate(input.birthDate);
  if (
    age === null ||
    age < MIN_ELIGIBLE_AGE ||
    age > MAX_ELIGIBLE_AGE
  ) {
    throw new Error("Cannot build profile without a valid eligible age.");
  }

  const ageBand = resolveAgeBand(age);
  if (ageBand === "unknown") {
    throw new Error("Cannot resolve age band for profile.");
  }

  return {
    age,
    ageBand,
    monthlyPremium: input.monthlyPremium,
    tenure: input.tenure,
    protectionLevel: input.protectionLevel,
    referencePrice: getReferencePrice(ageBand, input.protectionLevel),
  };
}

export function isCompetitivePremium(monthlyPremium: number): boolean {
  return monthlyPremium < COMPETITIVE_PREMIUM_THRESHOLD;
}

// ---------------------------------------------------------------------------
// Computation
// ---------------------------------------------------------------------------

export function computeCappedSavings(
  currentMonthlyPremium: number,
  referencePrice: number,
  tenure: SavingsTenureId,
): {
  yearlySavings: number;
  monthlySavings: number;
  estimatedMonthlyPremium: number;
  yearlySavingsMin: number;
  yearlySavingsMax: number;
  adjustedMonthlySaving: number;
} {
  const rawMonthlySaving = currentMonthlyPremium - referencePrice;
  const adjustedMonthlySaving =
    rawMonthlySaving * getTenureMultiplier(tenure);

  const maximumMonthlySaving = currentMonthlyPremium * MAX_SAVING_RATIO;

  const monthlySaving = Math.min(
    Math.max(adjustedMonthlySaving, 0),
    maximumMonthlySaving,
  );

  let annualSaving = Math.min(
    monthlySaving * 12,
    currentMonthlyPremium * 12 * MAX_SAVING_RATIO,
    MAX_YEARLY_SAVING,
  );

  annualSaving = Math.max(0, roundToTen(annualSaving));

  const monthlySavingDisplayed = Math.round(annualSaving / 12);
  const estimatedNewMonthlyPremium = Math.max(
    0,
    Math.round(currentMonthlyPremium - monthlySavingDisplayed),
  );

  const yearlySavingsMin = Math.max(
    0,
    Math.min(roundToTen(annualSaving * 0.85), MAX_YEARLY_SAVING),
  );
  const yearlySavingsMax = Math.max(
    yearlySavingsMin,
    Math.min(roundToTen(annualSaving * 1.1), MAX_YEARLY_SAVING),
  );

  return {
    yearlySavings: annualSaving,
    monthlySavings: monthlySavingDisplayed,
    estimatedMonthlyPremium: estimatedNewMonthlyPremium,
    yearlySavingsMin,
    yearlySavingsMax,
    adjustedMonthlySaving,
  };
}

export function resolveConfidence(
  currentMonthlyPremium: number,
  referencePrice: number,
): SavingsConfidence {
  if (referencePrice <= 0) return "low";

  const relativeGap =
    Math.abs(currentMonthlyPremium - referencePrice) / referencePrice;

  if (relativeGap > 0.25) return "high";
  if (relativeGap >= 0.1) return "medium";
  return "low";
}

export function buildPersonalizedReasons(profile: SavingsProfile): string[] {
  const reasons: string[] = [];

  if (profile.tenure === "plus-5-ans") {
    reasons.push(
      "Votre contrat est ancien et pourrait mériter une nouvelle mise en concurrence.",
    );
  }

  if (profile.monthlyPremium > profile.referencePrice * 1.2) {
    reasons.push(
      "Votre cotisation semble supérieure à l’estimation moyenne correspondant au profil renseigné.",
    );
  }

  if (
    profile.protectionLevel === "premium" ||
    profile.protectionLevel === "serenite-plus"
  ) {
    reasons.push(
      "La comparaison recherchera une meilleure maîtrise du budget tout en conservant un niveau de garanties renforcé.",
    );
  }

  return reasons.slice(0, 2);
}

const DEFAULT_CTA = "Recevoir mes devis personnalisés";

const OPTIMIZATION_MESSAGE =
  "Votre cotisation semble déjà relativement compétitive, mais une étude personnalisée peut permettre de réduire légèrement votre budget ou d’obtenir de meilleures garanties pour un tarif proche.\n\nDe nombreux contrats évoluent chaque année. Une comparaison avec un conseiller permet souvent d’identifier des offres plus récentes et mieux adaptées à votre profil.";

function buildOpportunityRange(monthlyPremium: number): {
  yearlySavingsMin: number;
  yearlySavingsMax: number;
  yearlySavings: number;
  monthlySavings: number;
} {
  const yearlySavingsMin = roundToTen(
    Math.min(120, Math.max(60, monthlyPremium * 0.9)),
  );
  const yearlySavingsMax = roundToTen(
    Math.min(
      200,
      Math.max(yearlySavingsMin + 60, monthlyPremium * 1.55),
    ),
  );
  const yearlySavings = roundToTen(
    (yearlySavingsMin + yearlySavingsMax) / 2,
  );

  return {
    yearlySavingsMin,
    yearlySavingsMax,
    yearlySavings,
    monthlySavings: Math.round(yearlySavings / 12),
  };
}

function buildConversionBenefits(yearlyMin: number, yearlyMax: number): string[] {
  return [
    `Économie potentielle estimée : ${yearlyMin} à ${yearlyMax} €/an`,
    "Vérification gratuite de vos garanties",
    "Analyse personnalisée par un conseiller",
  ];
}

function emptyAmounts(currentMonthlyPremium: number) {
  return {
    yearlySavings: 0,
    monthlySavings: 0,
    estimatedMonthlyPremium: Math.round(currentMonthlyPremium),
    yearlySavingsMin: null as number | null,
    yearlySavingsMax: null as number | null,
  };
}

function buildInvalidResult(message: string): SavingsEngineResult {
  return {
    resultType: "invalid",
    confidence: "low",
    title: "Estimation impossible",
    message,
    ctaLabel: DEFAULT_CTA,
    reasons: [],
    benefits: [
      "Vérification gratuite de vos garanties",
      "Analyse personnalisée par un conseiller",
      "Devis sans engagement",
    ],
    ...emptyAmounts(0),
    estimatedMonthlyPremium: 0,
    disclaimer: SAVINGS_DISCLAIMER,
  };
}

function buildCompetitiveResult(
  profile: SavingsProfile,
): SavingsEngineResult {
  const range = buildOpportunityRange(profile.monthlyPremium);

  return {
    resultType: "competitive",
    confidence: "medium",
    title: "Une optimisation de votre contrat semble possible",
    message: OPTIMIZATION_MESSAGE,
    ctaLabel: DEFAULT_CTA,
    reasons: buildPersonalizedReasons(profile),
    benefits: buildConversionBenefits(
      range.yearlySavingsMin,
      range.yearlySavingsMax,
    ),
    yearlySavings: range.yearlySavings,
    monthlySavings: range.monthlySavings,
    estimatedMonthlyPremium: Math.max(
      0,
      Math.round(profile.monthlyPremium - range.monthlySavings),
    ),
    yearlySavingsMin: range.yearlySavingsMin,
    yearlySavingsMax: range.yearlySavingsMax,
    disclaimer: SAVINGS_DISCLAIMER,
  };
}

function buildLowPotentialResult(
  profile: SavingsProfile,
  confidence: SavingsConfidence,
): SavingsEngineResult {
  const range = buildOpportunityRange(profile.monthlyPremium);

  return {
    resultType: "lowPotential",
    confidence,
    title: "Une optimisation de votre contrat semble possible",
    message: OPTIMIZATION_MESSAGE,
    ctaLabel: DEFAULT_CTA,
    reasons: buildPersonalizedReasons(profile),
    benefits: buildConversionBenefits(
      range.yearlySavingsMin,
      range.yearlySavingsMax,
    ),
    yearlySavings: range.yearlySavings,
    monthlySavings: range.monthlySavings,
    estimatedMonthlyPremium: Math.max(
      0,
      Math.round(profile.monthlyPremium - range.monthlySavings),
    ),
    yearlySavingsMin: range.yearlySavingsMin,
    yearlySavingsMax: range.yearlySavingsMax,
    disclaimer: SAVINGS_DISCLAIMER,
  };
}

function buildEstimatedSavingResult(
  profile: SavingsProfile,
  amounts: ReturnType<typeof computeCappedSavings>,
  confidence: SavingsConfidence,
): SavingsEngineResult {
  return {
    resultType: "estimatedSaving",
    confidence,
    title: "Une économie potentielle a été identifiée pour votre profil",
    message: `Soit environ ${amounts.monthlySavings} € par mois, pour une cotisation estimée autour de ${amounts.estimatedMonthlyPremium} €/mois à garanties comparables.\n\nUne étude personnalisée permet de confirmer cette estimation et de comparer des offres plus récentes, adaptées à vos besoins.`,
    ctaLabel: DEFAULT_CTA,
    reasons: buildPersonalizedReasons(profile),
    benefits: buildConversionBenefits(
      amounts.yearlySavingsMin,
      amounts.yearlySavingsMax,
    ),
    yearlySavings: amounts.yearlySavings,
    monthlySavings: amounts.monthlySavings,
    estimatedMonthlyPremium: amounts.estimatedMonthlyPremium,
    yearlySavingsMin: amounts.yearlySavingsMin,
    yearlySavingsMax: amounts.yearlySavingsMax,
    disclaimer: SAVINGS_DISCLAIMER,
  };
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export function estimateSavings(input: SavingsEngineInput): SavingsEngineResult {
  const validation = validateSavingsInput(input);
  if (!validation.ok) {
    return buildInvalidResult(
      validation.errors[0] ??
        "Impossible d’estimer votre économie avec les informations fournies.",
    );
  }

  const profile = buildSavingsProfile(input);

  if (isCompetitivePremium(profile.monthlyPremium)) {
    return buildCompetitiveResult(profile);
  }

  const amounts = computeCappedSavings(
    profile.monthlyPremium,
    profile.referencePrice,
    profile.tenure,
  );

  const confidence = resolveConfidence(
    profile.monthlyPremium,
    profile.referencePrice,
  );

  if (amounts.yearlySavings < LOW_POTENTIAL_YEARLY_THRESHOLD) {
    return buildLowPotentialResult(profile, confidence);
  }

  return buildEstimatedSavingResult(profile, amounts, confidence);
}
