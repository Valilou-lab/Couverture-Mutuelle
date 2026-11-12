const STORAGE_KEY = "cm-otp-lead-confirmed";

/** Set after a successful SMS OTP + lead — display-only, not sent to Vertikl. */
export function markOtpLeadConfirmed(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* private mode */
  }
}

export function hasOtpLeadConfirmed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}
