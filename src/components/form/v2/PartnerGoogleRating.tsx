import {
  formatV2PartnerGoogleRating,
  getV2PartnerGoogleRating,
} from "@/lib/v2/partners-registry";

type Props = {
  partnerId: string;
  /** Compact for multi-broker confirmation cards. */
  compact?: boolean;
  className?: string;
};

/**
 * Display-only Google rating — never wrap in a link (keeps users in the funnel).
 */
export function PartnerGoogleRating({
  partnerId,
  compact = false,
  className,
}: Props) {
  const rating = getV2PartnerGoogleRating(partnerId);
  if (!rating) return null;

  return (
    <p
      className={
        className ??
        (compact
          ? "mt-1 flex items-center justify-center gap-1 text-[0.65rem] font-semibold leading-none text-amber-700"
          : "mt-1.5 flex items-center justify-center gap-1.5 text-[0.75rem] font-semibold leading-snug text-amber-700 sm:text-[0.8rem]")
      }
    >
      <span className="text-[#f4b400]" aria-hidden="true">
        ★
      </span>
      <span>{formatV2PartnerGoogleRating(rating)} Google</span>
    </p>
  );
}
