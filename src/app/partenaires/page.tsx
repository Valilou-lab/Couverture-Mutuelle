import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/LegalPage";
import { PARTNERS, PARTNERS_INTRO } from "@/lib/partners";

export const metadata: Metadata = {
  title: "Nos Partenaires — Couverture Mutuelle",
};

export default function PartenairesPage() {
  return (
    <LegalPage title="Nos Partenaires" titleClassName="text-brand">
      <p>{PARTNERS_INTRO}</p>

      <ul className="mt-2 space-y-3">
        {PARTNERS.map((partner) => (
          <li
            key={`${partner.name}-${partner.orias}`}
            className="rounded-2xl border border-border bg-white px-4 py-3"
          >
            <p className="font-semibold text-[#3b0764]">{partner.name}</p>
            <p className="mt-0.5 text-sm text-zinc-500">
              ORIAS&nbsp;: {partner.orias}
            </p>
          </li>
        ))}
      </ul>
    </LegalPage>
  );
}
