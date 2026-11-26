"use client";

import { FormNavigation } from "@/components/form/FormNavigation";
import type { QuoteFormData } from "@/components/form/types";
import type { FieldErrors } from "@/components/form/validation";
import { SENIOR_ERROR } from "@/components/form/seniorForm";
import {
  IKI_CONSENT_OPTIN_TEXT,
  IKI_CONSENT_VALIDITY_TEXT,
  IKI_PARTNER_CONSENT_OPTIN_TEXT,
  IKI_PRIVACY_POLICY_LABEL,
  IKI_PRIVACY_POLICY_URL,
  type ConsentVariantId,
} from "@/lib/consent";
import { buildV2BrokerCountCopy } from "@/lib/v2/consent";
import {
  getV2PartnerById,
  getV2PartnerPrivacyPolicyUrl,
  isV2PartnerDistributable,
} from "@/lib/v2/partners-registry";
import type { EligiblePartner } from "./v2Types";
import { PartnerGoogleRating } from "./PartnerGoogleRating";
import { getV2PartnerLogoSrc } from "./v2Partners";

type Props = {
  partners: EligiblePartner[];
  data: QuoteFormData;
  errors: FieldErrors;
  /** Final Vertikl acquire failed — show friendly copy + retry (not “no brokers”). */
  acquireError?: boolean;
  submitting?: boolean;
  consentVariant?: Extract<ConsentVariantId, "senior" | "iki" | "default">;
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
 * Previous consent-step design, kept for /iki only.
 * Post-eligibility: partners from API response + dynamic consent only.
 * All wording follows the real precheck partner count.
 */
export function StepEligiblePartnersV2Legacy({
  partners,
  data,
  errors,
  acquireError = false,
  submitting = false,
  consentVariant = "senior",
  onPatch,
  onConfirm,
}: Props) {
  const iki = consentVariant === "iki";
  // Partners come exclusively from Vertikl precheck (via /api/v2/eligibility).
  // Registry only enriches logo / privacy when the buyer is mapped.
  const displayPartners = partners.map((partner) => {
    const registered = getV2PartnerById(partner.id);
    const distributable =
      registered && isV2PartnerDistributable(registered) ? registered : null;
    return {
      id: partner.id,
      name: distributable?.name ?? partner.name,
      logoSrc: getV2PartnerLogoSrc(partner.id, partner.name),
      privacyUrl: getV2PartnerPrivacyPolicyUrl(partner.id),
    };
  });

  const brokerCount = displayPartners.length;
  // Display-only preview: same template as the server. Authoritative text is
  // rebuilt in `/api/v2/leads` from the allowlist + eligibility token.
  const copy = buildV2BrokerCountCopy(brokerCount);
  const privacyPartners = displayPartners.filter((partner) => partner.privacyUrl);

  const dossierReady =
    brokerCount > 0 &&
    Boolean(data.consent) &&
    (!iki || Boolean(data.partnerConsent));

  const gridCols =
    brokerCount <= 1
      ? "grid-cols-1 max-w-[11rem] mx-auto"
      : brokerCount === 2
        ? "grid-cols-2"
        : "grid-cols-3";

  if (brokerCount === 0) {
    return (
      <div className="text-center">
        <h2 className="text-balance font-poppins text-[1.3rem] font-extrabold leading-tight tracking-[-0.02em] text-[#3b0764] sm:text-[1.5rem]">
          Nous n’avons pas trouvé de partenaire disponible pour votre profil
          pour le moment.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[0.98rem] leading-snug text-zinc-600 sm:text-[1.02rem]">
          Vous avez probablement déjà des devis en cours. Vous pouvez nous
          contacter à nouveau plus tard si vous n’avez pas encore trouvé la
          mutuelle idéale.
        </p>
        <a
          href="https://www.instagram.com/couverturemutuelle?exln=OXN2c25waWhtNjVl"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2.5 rounded-full border border-[#ddd6fe] bg-[#f5f0ff] px-5 py-3 text-[0.95rem] font-semibold text-[#3b0764] transition hover:border-brand/40 hover:bg-[#efe8ff]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 shrink-0"
            aria-hidden="true"
            fill="currentColor"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 1.621c-3.155 0-3.523.012-4.767.069-2.57.117-3.763 1.295-3.88 3.88-.057 1.243-.068 1.61-.068 4.767s.011 3.524.069 4.768c.117 2.579 1.304 3.762 3.88 3.879 1.243.058 1.61.07 4.766.07 3.156 0 3.523-.012 4.768-.07 2.572-.117 3.762-1.297 3.879-3.88.057-1.242.069-1.609.069-4.767s-.012-3.524-.07-4.768c-.116-2.577-1.3-3.762-3.879-3.879-1.243-.057-1.61-.068-4.766-.068zm0 2.916a5.3 5.3 0 1 1 0 10.6 5.3 5.3 0 0 1 0-10.6zm0 1.621a3.679 3.679 0 1 0 0 7.358 3.679 3.679 0 0 0 0-7.358zm5.404-.956a1.24 1.24 0 1 1 0 2.48 1.24 1.24 0 0 1 0-2.48z" />
          </svg>
          Suivre Couverture Mutuelle sur Instagram
        </a>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-balance text-center font-poppins text-[1.3rem] font-extrabold leading-tight tracking-[-0.02em] text-[#3b0764] sm:text-[1.5rem]">
        {copy.title}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-center text-[0.95rem] leading-snug text-zinc-600 sm:text-[1rem]">
        {copy.intro}
      </p>
      <ul className={`mt-5 grid gap-2 sm:gap-3 ${gridCols}`}>
        {displayPartners.map((partner) => {
          const logoSrc = partner.logoSrc;
          const privacyUrl = partner.privacyUrl;
          return (
            <li
              key={partner.id}
              className="flex flex-col rounded-[18px] border border-[#ddd6fe] bg-white px-2 py-2.5 shadow-[0_6px_18px_-14px_rgba(98,41,208,0.22)] sm:px-3 sm:py-3"
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
              <PartnerGoogleRating partnerId={partner.id} />
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

      <div className="mt-5 flex gap-3 rounded-[18px] border border-[#ddd6fe] bg-[#f5f0ff] px-3.5 py-3.5 text-left sm:px-4">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white"
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
          <p className="font-poppins text-[0.98rem] font-bold text-[#3b0764]">
            Vous gardez le contrôle
          </p>
          <p className="mt-1 text-[0.85rem] leading-snug text-zinc-600 sm:text-[0.9rem]">
            {copy.footer}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[18px] border-2 border-[#ddd6fe] bg-[#f5f0ff] p-4 text-[0.98rem] leading-relaxed text-foreground">
        {iki ? (
          <>
            <div className="flex items-start gap-3">
              <input
                id="v2-consent-opt-in"
                type="checkbox"
                checked={data.consent}
                onChange={(event) =>
                  onPatch({ consent: event.target.checked })
                }
                className="mt-[3px] h-6 w-6 shrink-0 accent-brand"
              />
              <label
                htmlFor="v2-consent-opt-in"
                className="min-w-0 cursor-pointer"
              >
                {IKI_CONSENT_OPTIN_TEXT}
              </label>
            </div>
            <div
              className="my-3.5 border-t border-[#ddd6fe]"
              aria-hidden="true"
            />
            <div className="flex items-start gap-3">
              <input
                id="v2-partner-consent-opt-in"
                type="checkbox"
                checked={data.partnerConsent}
                onChange={(event) =>
                  onPatch({ partnerConsent: event.target.checked })
                }
                className="mt-[3px] h-6 w-6 shrink-0 accent-brand"
              />
              <label
                htmlFor="v2-partner-consent-opt-in"
                className="min-w-0 cursor-pointer"
              >
                {IKI_PARTNER_CONSENT_OPTIN_TEXT}
              </label>
            </div>
            <p className="mt-3 text-[0.8125rem] leading-snug text-zinc-500">
              {IKI_CONSENT_VALIDITY_TEXT}{" "}
              <a
                href={IKI_PRIVACY_POLICY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-brand"
              >
                {IKI_PRIVACY_POLICY_LABEL}
              </a>
              .
            </p>
          </>
        ) : (
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
                {copy.consent}
              </label>
              {privacyPartners.length > 0 ? (
                <p className="mt-2 text-[0.8125rem] leading-snug text-zinc-500">
                  Politiques de protection des données&nbsp;:{" "}
                  {privacyPartners.map((partner, index) => {
                    const href = partner.privacyUrl!;
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
        )}
      </div>
      {errors.consent ? (
        <p className={SENIOR_ERROR} role="alert">
          {errors.consent}
        </p>
      ) : null}
      {errors.partnerConsent ? (
        <p className={SENIOR_ERROR} role="alert">
          {errors.partnerConsent}
        </p>
      ) : null}

      {acquireError ? (
        <div
          className="mt-4 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3.5 text-center"
          role="alert"
        >
          <p className="font-poppins text-[1.02rem] font-extrabold leading-snug text-[#9f1239]">
            Une erreur est survenue lors de l’envoi de votre demande.
          </p>
          <p className="mt-1.5 text-[0.95rem] leading-snug text-[#9f1239]">
            Vos informations n’ont pas été transmises. Merci de réessayer dans
            quelques instants.
          </p>
          <button
            type="button"
            disabled={submitting || !dossierReady}
            onClick={onConfirm}
            className="mt-3.5 inline-flex min-h-12 items-center justify-center rounded-full bg-[#9b4ff0] px-6 py-2.5 text-[1rem] font-extrabold text-white shadow-[0_10px_22px_-12px_rgba(155,79,240,0.55)] transition hover:bg-[#8b3de0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Envoi…" : "Réessayer"}
          </button>
        </div>
      ) : null}

      <FormNavigation
        onNext={onConfirm}
        nextLabel={copy.cta}
        disabled={!dossierReady || submitting}
        canContinue={dossierReady && !submitting}
      />
      {!dossierReady ? (
        <p className="mt-2 text-center text-[0.8125rem] leading-snug text-zinc-500">
          Acceptez le consentement pour activer le bouton.
        </p>
      ) : null}
    </div>
  );
}
