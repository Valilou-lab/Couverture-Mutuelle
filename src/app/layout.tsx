import type { Metadata } from "next";
import { Baloo_2, DM_Sans, Manrope, Nunito, Sora } from "next/font/google";
import { ChatbotSlot } from "@/components/chatbot/ChatbotSlot";
import { CookieConsentUI } from "@/components/cookies/CookieConsentUI";
import { MetaPixel } from "@/components/meta/MetaPixel";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
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

const nunito = Nunito({
  variable: "--font-nunito-family",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const sora = Sora({
  variable: "--font-sora-family",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.couverturemutuelle.fr"),
  title: "Couverture Mutuelle — Comparez les mutuelles santé",
  description:
    "Comparez gratuitement les mutuelles santé et obtenez un accompagnement personnalisé. Service sans engagement.",
  applicationName: "Couverture Mutuelle",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png" }],
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.couverturemutuelle.fr",
    siteName: "Couverture Mutuelle",
    title: "Couverture Mutuelle — Comparez les mutuelles santé",
    description:
      "Comparez gratuitement les mutuelles santé et obtenez un accompagnement personnalisé. Service sans engagement.",
    images: [
      {
        url: "/og-share.jpg?v=3",
        width: 1200,
        height: 630,
        alt: "Couverture Mutuelle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Couverture Mutuelle — Comparez les mutuelles santé",
    description:
      "Comparez gratuitement les mutuelles santé et obtenez un accompagnement personnalisé. Service sans engagement.",
    images: ["/og-share.jpg?v=3"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${dmSans.variable} ${manrope.variable} ${baloo2.variable} ${nunito.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex max-w-[100vw] flex-col overflow-x-hidden font-sans">
        <CookieConsentProvider>
          <QuoteJourneyProvider>
            {children}
            <ChatbotSlot />
          </QuoteJourneyProvider>
          <CookieConsentUI />
          <MetaPixel />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
