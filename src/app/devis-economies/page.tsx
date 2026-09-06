import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Savings simulator journey is disabled for launch.
 * The calculator UI and SavingsQuoteForm remain in the codebase
 * so the flow can be re-enabled later.
 */
export default function SavingsQuotePage() {
  redirect("/");
}
