import Image from "next/image";
import { SeniorQuoteForm } from "@/components/form/SeniorQuoteForm";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";

export function SeniorHero() {
  return (
    <>
      <TikTokFunnelTracker />
      <div className="min-[900px]:grid min-[900px]:grid-cols-[1fr_470px] min-[900px]:items-start min-[900px]:gap-10 min-[900px]:pt-6">
        <div>
          <div className="grid gap-2.5 pb-3.5 pt-[22px] text-center min-[900px]:pt-6 min-[900px]:text-left">
            <h1 className="text-balance font-poppins text-[clamp(1.6rem,6.4vw,2.2rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#3b0764]">
              Anticipez la hausse de votre mutuelle et{" "}
              <span className="text-[#a78bfa]">économisez dès maintenant</span>
            </h1>
            <p className="text-base text-zinc-600">
              Comparer sa mutuelle simplement.{" "}
              <strong className="text-brand">Un conseiller vous rappelle</strong>{" "}
              avec les offres adaptées à votre âge.
            </p>
          </div>
          <Image
            src="/images/hero-couple-economisez-v2.png"
            alt="Couple de retraités souriants"
            width={1024}
            height={535}
            sizes="(min-width: 1100px) 590px, 50vw"
            className="mt-2 hidden h-auto w-full rounded-[28px] shadow-[0_24px_60px_-30px_rgba(59,7,100,0.45)] min-[900px]:block"
          />
        </div>

        <div id="devis" className="scroll-mt-4">
          <SeniorQuoteForm />
        </div>
      </div>
    </>
  );
}
