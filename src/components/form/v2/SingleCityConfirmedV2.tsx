type Props = {
  city: string;
};

/**
 * V2-only confirmation when a postal code maps to exactly one city.
 * Non-interactive — not a button / select.
 */
export function SingleCityConfirmedV2({ city }: Props) {
  return (
    <div
      className="mt-3 rounded-[14px] border border-emerald-200/90 bg-[#ecfdf5] px-3.5 py-3 text-left"
      aria-live="polite"
    >
      <p className="flex items-center gap-2 font-poppins text-[1.05rem] font-extrabold leading-snug text-[#064e3b]">
        <span
          aria-hidden="true"
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[0.75rem] font-bold text-white"
        >
          ✓
        </span>
        <span>{city}</span>
      </p>
      <p className="mt-1 pl-8 text-[0.82rem] leading-snug text-emerald-800/80">
        Ville associée à votre code postal
      </p>
    </div>
  );
}
