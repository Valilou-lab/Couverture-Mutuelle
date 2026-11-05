const STEPS = [
  {
    number: "1",
    title: "Vous nous indiquez vos besoins",
    text: "Vous renseignez votre profil, vos garanties actuelles et ce que vous souhaitez améliorer.",
  },
  {
    number: "2",
    title: "Nous étudions votre demande",
    text: "Vos informations sont enregistrées de manière sécurisée. Un conseiller vous contacte pour vous présenter les devis adaptés à votre situation.",
  },
  {
    number: "3",
    title: "Vous décidez, tout simplement",
    text: "Vous choisissez l’offre qui vous convient, en ligne ou avec l’aide d’un conseiller.",
  },
] as const;

/**
 * Reassurance block under the main Couverture Mutuelle form (/ and /tiktok).
 * Presentation only — no form, tracking, or lead logic.
 */
export function FormReassuranceSteps() {
  return (
    <section
      aria-labelledby="comment-ca-se-passe-titre"
      className="mt-8 rounded-[1.5rem] border border-[#ddd6fe] bg-white px-5 py-8 sm:mt-10 sm:px-8 sm:py-10"
    >
      <h2
        id="comment-ca-se-passe-titre"
        className="text-balance text-center font-poppins text-[1.45rem] font-extrabold leading-snug tracking-[-0.02em] text-[#3b0764] sm:text-[1.75rem]"
      >
        Comment ça se passe&nbsp;?
      </h2>

      <ol className="mt-8 grid list-none gap-4 p-0 sm:mt-10 sm:gap-5 lg:grid-cols-3 lg:items-stretch lg:gap-5">
        {STEPS.map((step, index) => {
          const tinted = index % 2 === 0;
          return (
            <li
              key={step.number}
              className={`flex h-full flex-col items-center rounded-[1.35rem] border px-5 py-7 text-center sm:px-6 sm:py-8 ${
                tinted
                  ? "border-[#ddd6fe] bg-[#f5f0ff] shadow-[0_8px_22px_-16px_rgba(98,41,208,0.35)]"
                  : "border-[#ede9fe] bg-white shadow-[0_6px_18px_-14px_rgba(98,41,208,0.22)]"
              }`}
            >
              <span
                aria-hidden="true"
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-[1.35rem] font-extrabold text-white sm:h-14 sm:w-14 sm:text-[1.5rem]"
              >
                {step.number}
              </span>
              <h3 className="mt-5 text-balance font-poppins text-[1.15rem] font-extrabold leading-snug tracking-[-0.01em] text-[#3b0764] sm:mt-6 sm:text-[1.28rem]">
                <span className="sr-only">Étape {step.number} — </span>
                {step.title}
              </h3>
              <p className="mt-3 max-w-[32ch] text-[1.02rem] leading-relaxed text-[#3f3f46] sm:mt-3.5 sm:max-w-none sm:text-[1.08rem]">
                {step.text}
              </p>
            </li>
          );
        })}
      </ol>

      <p className="mx-auto mt-8 max-w-[36rem] rounded-2xl border border-[#ddd6fe]/80 bg-[#faf7ff] px-5 py-4 text-center text-[1.05rem] font-semibold leading-snug text-[#3b0764] sm:mt-10 sm:px-7 sm:py-[1.125rem] sm:text-[1.12rem]">
        Aucun engagement&nbsp;: vous restez libre de poursuivre, de comparer…
        ou de ne rien changer.
      </p>
    </section>
  );
}
