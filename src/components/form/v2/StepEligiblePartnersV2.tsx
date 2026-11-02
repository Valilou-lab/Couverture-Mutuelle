"use client";

import { FormNavigation } from "@/components/form/FormNavigation";
import type { QuoteFormData } from "@/components/form/types";
import type { FieldErrors } from "@/components/form/validation";
import {
  SENIOR_ERROR,
  SENIOR_INPUT,
  SENIOR_LABEL,
} from "@/components/form/seniorForm";
import { buildV2PartnerConsentText } from "@/lib/v2/consent";
import {
  getV2PartnerPrivacyPolicyUrl,
  resolveV2PartnersFromIds,
} from "@/lib/v2/partners-registry";
import type { EligiblePartner } from "./v2Types";
import { getV2PartnerLogoSrc } from "./v2Partners";

type Props = {
  partners: EligiblePartner[];
  data: QuoteFormData;
  errors: FieldErrors;
  onPatch: (patch: Partial<QuoteFormData>) => void;
  onConfirm: () => void;
};

function PartnerOfferBadge() {
  return (
    <p className="mt-2 flex items-start justify-center gap-1 text-center text-[0.68rem] font-semibold leading-snug text-emerald-700 sm:text-[0.75rem]">
      <span
        aria-hidden="true"
        className="mt-[1px] inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[0.55rem] font-bold text-white sm:h-4 sm:w-4 sm:text-[0.625rem]"
      >
        ✓
      </span>
      <span>Peut vous proposer un devis</span>
    </p>
  );
}

/**
 * Post-eligibility: partners from API response + identity + dynamic consent.
 * Displays only what `/api/v2/eligibility` returned; privacy URLs from registry.
 */
export function StepEligiblePartnersV2({
  partners,
  data,
  errors,
  onPatch,
  onConfirm,
}: Props) {
  // Drop any id that is not distributable in the allowlist (defense in depth).
  const safePartners = resolveV2PartnersFromIds(partners.map((p) => p.id));

  // Display-only preview: same template as the server. Authoritative text is
  // rebuilt in `/api/v2/leads` from the allowlist + eligibility token.
  const consentText = buildV2PartnerConsentText(safePartners);
  const privacyPartners = safePartners.filter(
    (partner) => partner.privacyPolicyUrl,
  );

  const dossierReady =
    Boolean(data.firstName.trim()) &&
    Boolean(data.lastName.trim()) &&
    Boolean(data.consent);

  const gridCols =
    safePartners.length <= 1
      ? "grid-cols-1 max-w-[11rem] mx-auto"
      : safePartners.length === 2
        ? "grid-cols-2"
        : "grid-cols-3";

  return (
    <div>
      <h2 className="text-balance text-center font-poppins text-[1.3rem] font-extrabold leading-tight tracking-[-0.02em] text-[#3b0764] sm:text-[1.5rem]">
        Ces organismes peuvent vous proposer des devis{" "}
        <span aria-hidden="true">🎉</span>
      </h2>

      {safePartners.length === 0 ? (
        <p className="mt-5 rounded-[18px] border border-brand-muted bg-[#f7f4ff] px-4 py-4 text-center text-[0.98rem] text-[#3b0764]">
          Aucun partenaire éligible pour le moment.
        </p>
      ) : (
        <ul className={`mt-5 grid gap-2 sm:gap-3 ${gridCols}`}>
          {safePartners.map((partner) => {
            const logoSrc = getV2PartnerLogoSrc(partner.id, partner.name);
            const privacyUrl = getV2PartnerPrivacyPolicyUrl(partner.id);
            return (
              <li
                key={partner.id}
                className="flex flex-col rounded-[16px] border border-brand/15 bg-white px-2 py-2.5 shadow-[0_1px_0_rgba(109,40,217,0.04)] sm:px-3 sm:py-3"
              >
                <div className="flex h-12 items-center justify-center sm:h-14">
                  {logoSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element -- partner logos
                    <img
                      src={logoSrc}
                      alt={partner.name}
                      className="h-full w-full object-contain"
                      draggable={false}
                    />
                  ) : (
                    <p className="text-center font-poppins text-[0.8rem] font-semibold leading-tight text-[#3b0764] sm:text-sm">
                      {partner.name}
                    </p>
                  )}
                </div>
                {logoSrc ? (
                  <p className="mt-1.5 text-center font-poppins text-[0.72rem] font-semibold leading-tight text-[#3b0764] sm:text-[0.8rem]">
                    {partner.name}
                  </p>
                ) : null}
                <PartnerOfferBadge />
                {privacyUrl ? (
                  <a
                    href={privacyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-center text-[0.65rem] font-medium text-zinc-500 underline-offset-2 hover:text-brand hover:underline sm:text-[0.7rem]"
                  >
                    Protection de vos données&nbsp;↗
                  </a>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-5 flex gap-3 rounded-[18px] border border-emerald-200/80 bg-emerald-50/80 px-3.5 py-3.5 text-left sm:px-4">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="font-poppins text-[0.98rem] font-bold text-[#064e3b]">
            Vous gardez le contrôle
          </p>
          <p className="mt-1 text-[0.85rem] leading-snug text-zinc-600 sm:text-[0.9rem]">
            Vos coordonnées seront transmises uniquement aux organismes affichés
            ci-dessus. Vos données sont sécurisées et utilisées uniquement dans
            le cadre de votre comparatif de mutuelle.
          </p>
        </div>
      </div>

      <h3 className="mt-5 text-center font-poppins text-[1.2rem] font-extrabold tracking-[-0.02em] text-[#3b0764] sm:text-[1.3rem]">
        On finalise&nbsp;!
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="v2-firstName" className={SENIOR_LABEL}>
            Prénom
          </label>
          <input
            id="v2-firstName"
            autoComplete="given-name"
            value={data.firstName}
            onChange={(event) => onPatch({ firstName: event.target.value })}
            className={SENIOR_INPUT}
          />
          {errors.firstName ? (
            <p className={SENIOR_ERROR} role="alert">
              {errors.firstName}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="v2-lastName" className={SENIOR_LABEL}>
            Nom
          </label>
          <input
            id="v2-lastName"
            autoComplete="family-name"
            value={data.lastName}
            onChange={(event) => onPatch({ lastName: event.target.value })}
            className={SENIOR_INPUT}
          />
          {errors.lastName ? (
            <p className={SENIOR_ERROR} role="alert">
              {errors.lastName}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 rounded-[18px] border-2 border-brand-muted bg-[#f7f4ff] p-4 text-[0.98rem] leading-relaxed text-foreground">
        <div className="flex items-start gap-3">
          <input
            id="v2-consent-opt-in"
            type="checkbox"
            checked={data.consent}
            onChange={(event) => onPatch({ consent: event.target.checked })}
            className="mt-[3px] h-6 w-6 shrink-0 accent-brand"
          />
          <div className="min-w-0">
            <label htmlFor="v2-consent-opt-in" className="cursor-pointer">
              {consentText}
            </label>
            {privacyPartners.length > 0 ? (
              <p className="mt-2 text-[0.8125rem] leading-snug text-zinc-500">
                Politiques de protection des données&nbsp;:{" "}
                {privacyPartners.map((partner, index) => {
                  const href = partner.privacyPolicyUrl!;
                  return (
                    <span key={partner.id}>
                      {index > 0 ? " · " : null}
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-zinc-600 underline underline-offset-2 hover:text-brand"
                      >
                        {partner.name}
                      </a>
                    </span>
                  );
                })}
              </p>
            ) : null}
            <p className="mt-2 text-[0.8125rem] leading-snug text-zinc-500">
              Consentement valable 12 mois, retirable à tout moment.{" "}
              <a
                href="https://www.couverturemutuelle.fr/politique-de-confidentialite"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-brand"
              >
                Politique de confidentialité
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      {errors.consent ? (
        <p className={SENIOR_ERROR} role="alert">
          {errors.consent}
        </p>
      ) : null}

      <FormNavigation
        onNext={onConfirm}
        nextLabel={
          dossierReady
            ? "Confirmer mon dossier"
            : "Complétez vos informations"
        }
        disabled={!dossierReady}
      />
      {!dossierReady ? (
        <p className="mt-2 text-center text-[0.8125rem] leading-snug text-zinc-500">
          Indiquez votre prénom, votre nom, puis acceptez le consentement pour
          activer le bouton.
        </p>
      ) : null}
    </div>
  );
}
