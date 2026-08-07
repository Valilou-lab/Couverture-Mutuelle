import type { Metadata } from "next";
import { Baloo_2, DM_Sans, Manrope, Sora } from "next/font/google";
import { ChatbotSlot } from "@/components/chatbot/ChatbotSlot";
import { QuoteJourneyProvider } from "@/context/QuoteJourneyContext";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope-family",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const baloo2 = Baloo_2({
  variable: "--font-baloo-family",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sora = Sora({
  variable: "--font-sora-family",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Couverture Mutuelle — Comparez les mutuelles santé",
  description:
    "Comparez gratuitement les mutuelles santé et obtenez un accompagnement personnalisé. Service sans engagement.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${dmSans.variable} ${manrope.variable} ${baloo2.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <QuoteJourneyProvider>
          {children}
          <ChatbotSlot />
        </QuoteJourneyProvider>
      </body>
    </html>
  );
}
