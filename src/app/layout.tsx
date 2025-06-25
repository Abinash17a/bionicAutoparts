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

export const metadata: Metadata = {
  title: "Bionics Autoparts",
  icons: {
    icon: "/favicon.png",
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
        <title>Nationwide Salvage Yards | Affordable Used Auto Parts Online - Bionics Auto Parts</title>
        <meta name="description" content="Find top-quality used auto parts at unbeatable prices with Bionics Auto Parts! Serving all 50 U.S. states, we offer affordable recycled car parts, rare components, and nationwide shipping. Shop online for sustainable, budget-friendly solutions today." />
        <meta name="keywords" content="nationwide salvage yards, used auto parts online, affordable car parts, recycled auto parts, eco-friendly car parts, salvage yards near me, car parts for all states, rare auto parts, Bionics Auto Parts, sustainable car repair solutions" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Bionics Auto Parts" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16746690398"></script>
        <script
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
        <GoogleTagManager />
        <Header />
        <main className="flex-grow">{children}</main>
        <CarCompanySlider />
        <Footer />
      </body>
    </html>
  );
}

