import type { AcquisitionParams } from "@/lib/vertikl/types";

const ACQUISITION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const satisfies readonly (keyof AcquisitionParams)[];

/** Read UTM / click IDs from the current URL (client-side). */
export function readAcquisitionParams(
  search: string = typeof window !== "undefined" ? window.location.search : "",
): AcquisitionParams {
  const params = new URLSearchParams(search);
  const result: AcquisitionParams = {};

  for (const key of ACQUISITION_KEYS) {
    const value = params.get(key)?.trim();
    if (value) {
      result[key] = value;
    }
  }

  return result;
}
