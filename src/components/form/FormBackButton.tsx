"use client";

type Props = {
  onBack: () => void;
  disabled?: boolean;
  className?: string;
};

export function FormBackButton({
  onBack,
  disabled = false,
  className = "",
}: Props) {
  return (
    <button
      type="button"
      onClick={onBack}
      disabled={disabled}
      aria-label="Retour"
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-brand transition hover:bg-brand-soft disabled:opacity-40 ${className}`.trim()}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M15 5 8 12l7 7"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
