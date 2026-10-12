import type { Metadata } from "next";
import { AcquisitionCapture } from "@/components/acquisition/AcquisitionCapture";
import { ChatbotSlot } from "@/components/chatbot/ChatbotSlot";
import { CookieConsentUI } from "@/components/cookies/CookieConsentUI";
import { GoogleAdsTag } from "@/components/gtm/GoogleAdsTag";
import { GoogleTagManager } from "@/components/gtm/GoogleTagManager";
import { MetaPixel } from "@/components/meta/MetaPixel";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import { QuoteJourneyProvider } from "@/context/QuoteJourneyContext";
import "./globals.css";

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
    <html lang="fr" className="h-full antialiased">
      <body className="flex min-h-full max-w-[100vw] flex-col overflow-x-hidden font-sans">
        <GoogleAdsTag />
        <GoogleTagManager />
        <AcquisitionCapture />
        <CookieConsentProvider>
          <QuoteJourneyProvider>
            {children}
            <ChatbotSlot />
          </QuoteJourneyProvider>
          <CookieConsentUI />
          {/* Meta Pixel + CAPI relay — app code, not GTM; loads only after marketing consent. */}
          <MetaPixel />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
