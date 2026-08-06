import Image from "next/image";

const steps = [
  {
    number: "1",
    title: "Vous remplissez un formulaire",
    text: "En moins de 2 minutes. Simple, rapide, sécurisé.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          d="M8 4h8a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9 9h6M9 13h6M9 17h3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "2",
    title: "Un conseiller étudie votre situation",
    text: "Un spécialiste dédié analyse vos besoins et votre budget.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          d="M22 16.92v2a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 3.18 2 2 0 0 1 4.11 1h2a2 2 0 0 1 2 1.72c.13.96.35 1.9.67 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.54 2.81.67A2 2 0 0 1 22 16.92Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    number: "3",
    title: "Vous recevez plusieurs propositions",
    text: "Comparez les offres adaptées et choisissez sereinement.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-6Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M14 2v6h6M9 15l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section
      id="fonctionnement"
      className="scroll-mt-24 bg-white px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center lg:mb-10 lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
            Comment ça marche
          </p>
          <h2 className="mt-2 font-manrope text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            3 étapes simples pour trouver votre mutuelle
          </h2>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative overflow-hidden rounded-[1.75rem] shadow-[0_24px_60px_-30px_rgba(109,40,217,0.45)]">
            <Image
              src="/seniors-promenade.png"
              alt="Seniors souriants se promenant ensemble"
              width={1024}
              height={682}
              className="h-full w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={false}
            />
          </div>

          <div>
            <ol className="space-y-4 pl-3">
              {steps.map((step) => (
                <li
                  key={step.number}
                  className="relative rounded-2xl border border-border bg-white p-5 pl-6 shadow-sm"
                >
                  <span className="absolute -left-3 top-5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white shadow-sm">
                    {step.number}
                  </span>
                  <div className="flex gap-4">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                      {step.icon}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-foreground sm:text-lg">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex justify-center lg:justify-start">
              <a
                href="#devis"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
              >
                Je compare gratuitement
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
