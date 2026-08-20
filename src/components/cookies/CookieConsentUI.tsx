"use client";

import { useState } from "react";
import { useCookieConsent } from "@/context/CookieConsentContext";
import type { CookieConsentChoice } from "@/lib/cookie-consent";

function PreferencesForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: CookieConsentChoice;
  onSave: (choice: CookieConsentChoice) => void;
  onCancel: () => void;
}) {
  const [choice, setChoice] = useState<CookieConsentChoice>(initial);

  return (
    <div className="space-y-4">
      <label className="flex items-start gap-3 text-sm text-zinc-700">
        <input
          type="checkbox"
          checked
          disabled
          className="mt-1 accent-brand"
        />
        <span>
          <span className="font-semibold text-foreground">Nécessaires</span>
          <span className="mt-0.5 block text-zinc-600">
            Indispensables au fonctionnement du site et à la mémorisation de vos
            choix cookies.
          </span>
        </span>
      </label>

      <label className="flex items-start gap-3 text-sm text-zinc-700">
        <input
          type="checkbox"
          checked={choice.preferences}
          onChange={(event) =>
            setChoice((current) => ({
              ...current,
              preferences: event.target.checked,
            }))
          }
          className="mt-1 accent-brand"
        />
        <span>
          <span className="font-semibold text-foreground">Préférences</span>
          <span className="mt-0.5 block text-zinc-600">
            Mémorisent certains choix d’affichage ou de fonctionnalités.
          </span>
        </span>
      </label>

      <label className="flex items-start gap-3 text-sm text-zinc-700">
        <input
          type="checkbox"
          checked={choice.analytics}
          onChange={(event) =>
            setChoice((current) => ({
              ...current,
              analytics: event.target.checked,
            }))
          }
          className="mt-1 accent-brand"
        />
        <span>
          <span className="font-semibold text-foreground">Mesure d’audience</span>
          <span className="mt-0.5 block text-zinc-600">
            Aident à comprendre l’usage du site de façon agrégée.
          </span>
        </span>
      </label>

      <label className="flex items-start gap-3 text-sm text-zinc-700">
        <input
          type="checkbox"
          checked={choice.marketing}
          onChange={(event) =>
            setChoice((current) => ({
              ...current,
              marketing: event.target.checked,
            }))
          }
          className="mt-1 accent-brand"
        />
        <span>
          <span className="font-semibold text-foreground">
            Publicité / marketing
          </span>
          <span className="mt-0.5 block text-zinc-600">
            Permettent de mesurer les campagnes publicitaires (ex. Meta Pixel).
            Aucune donnée de santé du formulaire n’est envoyée.
          </span>
        </span>
      </label>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-11 rounded-full border border-border bg-white px-5 font-sora text-sm font-semibold text-foreground hover:border-brand hover:text-brand"
        >
          Fermer
        </button>
        <button
          type="button"
          onClick={() => onSave(choice)}
          className="min-h-11 rounded-full bg-brand px-5 font-sora text-sm font-semibold text-white hover:bg-[#5b21b6]"
        >
          Enregistrer mes choix
        </button>
      </div>
    </div>
  );
}

export function CookieConsentUI() {
  const {
    preferences,
    bannerOpen,
    preferencesOpen,
    openPreferences,
    closePreferences,
    acceptAll,
    refuseOptional,
    saveChoice,
  } = useCookieConsent();

  const initialChoice: CookieConsentChoice = {
    preferences: preferences?.preferences ?? false,
    analytics: preferences?.analytics ?? false,
    marketing: preferences?.marketing ?? false,
  };

  return (
    <>
      {bannerOpen ? (
        <div
          className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-black/25 p-4 backdrop-blur-[1px] sm:p-6"
          role="region"
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-desc"
        >
          <div className="pointer-events-auto relative w-full max-w-md rounded-2xl border border-brand/20 bg-white p-4 shadow-[0_18px_50px_-12px_rgba(59,7,100,0.28)] sm:max-w-lg sm:p-5">
            <button
              type="button"
              onClick={refuseOptional}
              aria-label="Fermer et refuser les cookies non essentiels"
              className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition hover:bg-brand-soft hover:text-brand"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                ×
              </span>
            </button>

            <div className="pr-8">
              <p
                id="cookie-banner-title"
                className="font-sora text-[0.9375rem] font-bold tracking-tight text-[#3b0764] sm:text-base"
              >
                Vous gardez le contrôle.
              </p>
              <p
                id="cookie-banner-desc"
                className="mt-1.5 text-[0.8125rem] leading-snug text-zinc-600 sm:text-sm sm:leading-relaxed"
              >
                Les cookies publicitaires nous permettent de mesurer nos
                campagnes et de vous proposer des contenus plus pertinents. Vous
                pouvez accepter, refuser ou modifier votre choix à tout moment,
                sans impact sur votre demande de devis.
              </p>
              <button
                type="button"
                onClick={openPreferences}
                className="mt-2 text-[0.75rem] font-medium text-brand/80 underline underline-offset-2 transition hover:text-brand sm:text-[0.8125rem]"
              >
                Gérer mes cookies
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={refuseOptional}
                className="min-h-10 rounded-full border border-zinc-300 bg-white px-3 font-sora text-[0.8125rem] font-semibold text-foreground transition hover:border-brand hover:bg-brand-soft hover:text-brand sm:min-h-11 sm:text-sm"
              >
                Tout refuser
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="min-h-10 rounded-full border border-brand bg-brand px-3 font-sora text-[0.8125rem] font-semibold text-white transition hover:bg-[#5b21b6] sm:min-h-11 sm:text-sm"
              >
                Tout accepter
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {preferencesOpen ? (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-prefs-title"
            className="w-full max-w-lg rounded-2xl border border-border bg-white p-5 shadow-xl sm:p-6"
          >
            <h2
              id="cookie-prefs-title"
              className="font-sora text-lg font-semibold text-foreground"
            >
              Gérer mes cookies
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Modifiez vos choix à tout moment. Les cookies publicitaires ne
              sont activés que si vous les acceptez. Votre demande de devis
              n’est pas affectée.
            </p>
            <div className="mt-5">
              <PreferencesForm
                key={
                  preferences?.updatedAt ??
                  `${initialChoice.marketing}-${initialChoice.analytics}-${initialChoice.preferences}`
                }
                initial={initialChoice}
                onSave={saveChoice}
                onCancel={closePreferences}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
