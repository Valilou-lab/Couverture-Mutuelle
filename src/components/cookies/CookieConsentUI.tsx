"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const root = document.documentElement;
    if (!bannerOpen) {
      root.style.scrollPaddingBottom = "";
      return;
    }

    const apply = () => {
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      root.style.scrollPaddingBottom = desktop
        ? "9rem"
        : "max(14rem, 38svh)";
    };
    apply();

    const media = window.matchMedia("(min-width: 1024px)");
    media.addEventListener("change", apply);
    return () => {
      media.removeEventListener("change", apply);
      root.style.scrollPaddingBottom = "";
    };
  }, [bannerOpen]);

  return (
    <>
      {bannerOpen ? (
        <div
          className="fixed inset-x-0 bottom-0 z-[80] max-h-[40svh] overflow-y-auto rounded-t-2xl border-t border-brand/15 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_28px_-8px_rgba(59,7,100,0.18)] lg:max-h-[30svh] lg:overflow-visible"
          role="region"
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-desc"
        >
          <div className="mx-auto flex w-full max-w-[84rem] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:gap-8 lg:px-10 lg:py-5">
            <div className="min-w-0 flex-1 lg:max-w-[70%]">
              <p
                id="cookie-banner-title"
                className="font-sora text-base font-bold leading-snug tracking-tight text-[#3b0764] sm:text-lg"
              >
                Votre choix concernant les cookies
              </p>
              <p
                id="cookie-banner-desc"
                className="mt-1.5 text-sm leading-snug text-zinc-600 lg:mt-2 lg:max-w-3xl lg:leading-relaxed"
              >
                <span className="lg:hidden">
                  Cookies publicitaires pour mesurer nos campagnes. Aucun impact
                  sur votre devis.
                </span>
                <span className="hidden lg:inline">
                  Nous utilisons des cookies publicitaires pour mesurer nos
                  campagnes et améliorer nos services. Votre choix n’a aucun
                  impact sur votre demande de devis.
                </span>
              </p>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-2.5 lg:w-[min(100%,22rem)] lg:gap-2">
              <button
                type="button"
                onClick={acceptAll}
                className="min-h-12 w-full rounded-full bg-brand px-5 font-sora text-sm font-semibold text-white transition hover:bg-[#5b21b6] sm:min-h-[3.25rem] sm:text-base lg:min-h-11 lg:text-sm"
              >
                Tout accepter
              </button>
              <button
                type="button"
                onClick={refuseOptional}
                className="min-h-12 w-full rounded-full border-2 border-brand bg-white px-5 font-sora text-sm font-semibold text-brand transition hover:bg-brand-soft sm:min-h-[3.25rem] sm:text-base lg:min-h-11 lg:text-sm"
              >
                Tout refuser
              </button>
              <button
                type="button"
                onClick={openPreferences}
                className="mx-auto py-1 text-sm font-medium text-brand underline underline-offset-2 transition hover:text-[#5b21b6]"
              >
                Gérer mes cookies
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
