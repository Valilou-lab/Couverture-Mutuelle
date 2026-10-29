"use client";

import { useEffect, useState } from "react";

/**
 * Mobile-only sticky CTA in IKI style (same behaviour as the senior sticky
 * CTA: shown once the quote form has scrolled above the viewport).
 */
export function IkiStickyCta({ ctaLabel }: { ctaLabel: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const form = document.getElementById("devis");
    if (!form || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`iki-sticky-cta fixed inset-x-0 bottom-0 z-30 bg-white/95 px-4 pb-[calc(14px+env(safe-area-inset-bottom,0px))] pt-3 backdrop-blur-sm transition-transform duration-250 ease-out motion-reduce:transition-none min-[760px]:hidden ${
        show ? "translate-y-0" : "translate-y-[110%]"
      }`}
    >
      <a href="#devis" tabIndex={show ? 0 : -1} className="iki-cta min-h-14 !text-[1.2rem]">
        {ctaLabel}
      </a>
    </div>
  );
}
