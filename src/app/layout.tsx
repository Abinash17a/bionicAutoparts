/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CarCompanySlider from "./components/Companyslider";
import Script from "next/script";
import Header from './components/Header';
import GoogleTagManager from "./components/GoogleTagManager";
import { LoadingProvider } from "./context/LoadingContext";
import LoadingWrapper from "./components/LoadingWrapper";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.usausedautopart.com'),
  title: "Used Auto Parts USA | Quality Parts Online",
  description: "Find quality used auto parts in the USA. Search used engines, transmissions and OEM auto parts with nationwide availability and shipping.",
  icons: {
    icon: "/favicon.png",
  },
  alternates: {
    canonical: '/',
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
        <meta name="robots" content="index, follow" />
        <meta name="author" content="USA Used Auto Parts" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-16746690398"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-16746690398');
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen font-sans">
        <LoadingProvider>
          <GoogleTagManager />
          <Header />
          <main className="flex-grow">{children}</main>
          <LoadingWrapper>
            <CarCompanySlider />
          </LoadingWrapper>
          <LoadingWrapper>
            <Footer />
          </LoadingWrapper>
        </LoadingProvider>
      </body>
    </html>
  );
}

