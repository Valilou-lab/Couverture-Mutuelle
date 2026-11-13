import { Inter } from "next/font/google";
import { HomeLanding } from "@/components/landing/home/HomeLanding";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-tranches",
  display: "swap",
});

export default function Home() {
  return (
    <HomeLanding
      desktopBlurBackdrop
      className={`${inter.variable} lp-v2-type`}
    />
  );
}
