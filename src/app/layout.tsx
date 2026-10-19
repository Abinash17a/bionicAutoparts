/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
});
import 'slick-carousel/slick/slick.css';
import CarCompanySlider from "./components/Companyslider";
import Script from "next/script";
import Header from './components/Header';
import GoogleTagManager from "./components/GoogleTagManager";
import { LoadingProvider } from "./context/LoadingContext";
import ChatbotRoot from "./components/chatbot/ChatbotRoot";
import FloatingVinSticker from "./components/FloatingVinSticker";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.usausedautopart.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Used Auto Parts Online | Recycled OEM Engines & Transmissions",
    template: "%s | USA Used Auto Parts",
  },
  description:
    "Find recycled OEM engines, transmissions, body parts and more. Search by year, make, model, part number or VIN, with clear fitment, warranty and shipping information.",
  keywords: [
    "used auto parts",
    "recycled OEM engines",
    "used transmissions",
    "salvage auto parts",
    "replacement car parts",
    "OEM car parts online",
  ],
  authors: [{ name: "USA Used Auto Parts" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "USA Used Auto Parts",
    locale: "en_US",
    url: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "48x48" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "AutoPartsStore",
                  "@id": `${siteUrl}/#organization`,
                  "name": "USA Used Auto Parts",
                  "url": siteUrl,
                  "logo": `${siteUrl}/logo1.png`,
                  "image": `${siteUrl}/logo1.png`,
                  "description": "Nationwide supplier of certified recycled OEM used engines, transmissions, and auto parts with warranty.",
                  "telephone": "+1-617-516-3140",
                  "email": "part@usausedautopart.com",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "6332 Deep Canyon Dr",
                    "addressLocality": "Beverly Hills",
                    "addressRegion": "CA",
                    "postalCode": "90210",
                    "addressCountry": "US"
                  },
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                      "opens": "09:00",
                      "closes": "17:00"
                    },
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": "Saturday",
                      "opens": "10:00",
                      "closes": "14:00"
                    }
                  ],
                  "priceRange": "$$"
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  "url": siteUrl,
                  "name": "USA Used Auto Parts",
                  "publisher": {
                    "@id": `${siteUrl}/#organization`
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${siteUrl}/parts?search={search_term_string}`,
                    "query-input": "required name=search_term_string"
                  }
                }
              ]
            }),
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-16746690398"
          strategy="lazyOnload"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'granted'
              });
              gtag('js', new Date());
              gtag('config', 'AW-16746690398');
            `,
          }}
        />
      </head>
      <body className={`flex flex-col min-h-screen font-sans ${poppins.className} ${poppins.variable}`}>
        <LoadingProvider>
          <GoogleTagManager />
          <Header />
          <main className="flex-grow">{children}</main>
          <CarCompanySlider />
          <Footer />
          <ChatbotRoot />
          <FloatingVinSticker />
        </LoadingProvider>
      </body>
    </html>
  );
}

