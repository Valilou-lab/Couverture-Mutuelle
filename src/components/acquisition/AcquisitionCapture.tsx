"use client";

import { useEffect } from "react";
import { captureFirstTouchAcquisition } from "@/lib/acquisition";

/** Captures first-touch acquisition as soon as the app hydrates. */
export function AcquisitionCapture() {
  useEffect(() => {
    captureFirstTouchAcquisition();
  }, []);

  return null;
}
