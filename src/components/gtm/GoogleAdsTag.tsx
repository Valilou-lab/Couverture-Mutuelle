import Script from "next/script";
import {
  GOOGLE_ADS_CONFIG_SCRIPT,
  GOOGLE_ADS_ID,
  GOOGLE_CONSENT_DEFAULT_SCRIPT,
} from "@/lib/google-ads";

/**
 * Consent Mode v2 defaults (head, before any Google tag) + Google Ads tag.
 * Mount once from the root layout only — do not duplicate on pages.
 */
export function GoogleAdsTag() {
  return (
    <>
      <Script
        id="google-consent-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: GOOGLE_CONSENT_DEFAULT_SCRIPT }}
      />
      <Script
        id="google-ads-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-ads-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: GOOGLE_ADS_CONFIG_SCRIPT }}
      />
    </>
  );
}
