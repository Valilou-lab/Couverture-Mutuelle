import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/LegalPage";
import { PartnerCard } from "@/components/partners/PartnerCard";
import {
  PARTNERS,
  PARTNERS_INTRO,
  PARTNERS_INTRO_NOTE,
} from "@/lib/partners";

export const metadata: Metadata = {
  title: "Nos Partenaires — Couverture Mutuelle",
};

export default function PartenairesPage() {
  return (
    <LegalPage title="Nos partenaires" titleClassName="text-brand">
      <p>{PARTNERS_INTRO}</p>
      <p className="mt-2 text-sm text-zinc-500">{PARTNERS_INTRO_NOTE}</p>

      <ul className="mt-5 list-none space-y-3 p-0">
        {PARTNERS.map((partner) => (
          <PartnerCard
            key={`${partner.name}-${partner.orias}`}
            name={partner.name}
            orias={partner.orias}
          />
        ))}
      </ul>
    </LegalPage>
  );
}
