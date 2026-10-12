"use client";

import { useEffect, useState } from "react";
import { CTA_CLASS } from "./SeniorSections";

/** Mobile-only CTA, shown once the quote form has scrolled above the viewport. */
export function SeniorStickyCta() {
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
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-[#ddd6fe] bg-white/95 px-4 pb-[calc(10px+env(safe-area-inset-bottom,0px))] pt-2.5 transition-transform duration-250 ease-out motion-reduce:transition-none min-[760px]:hidden ${
        show ? "translate-y-0" : "translate-y-[110%]"
      }`}
    >
      <a href="#devis" tabIndex={show ? 0 : -1} className={`${CTA_CLASS} min-h-14`}>
        Je compare gratuitement
      </a>
    </div>
  );
}
