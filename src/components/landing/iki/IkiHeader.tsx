import Image from "next/image";

/**
 * Comparator header (IKI reference comparator page): white bar, official IKI
 * logo + « GRATUIT : Comparez les » and a violet highlighted « mutuelles
 * seniors ». No navigation, no call-to-action (the form sits right below).
 */
export function IkiHeader() {
  return (
    <header className="iki-header">
      <div className="mx-auto flex min-h-[64px] max-w-[1120px] items-center justify-center gap-3 px-4 py-2 min-[900px]:min-h-[96px] min-[900px]:gap-4 min-[900px]:px-6">
        <Image
          src="/images/iki/logo-iki-couleur.png"
          alt="IKI Assurances"
          width={60}
          height={40}
          priority
          className="block h-10 w-auto shrink-0 min-[900px]:h-14"
        />
        <p className="iki-header-claim">
          <span className="iki-header-claim-top">GRATUIT : Comparez les</span>
          <span className="iki-header-claim-mark">mutuelles seniors</span>
        </p>
      </div>
    </header>
  );
}
