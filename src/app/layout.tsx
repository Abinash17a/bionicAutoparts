/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CarCompanySlider from "./components/Companyslider";
import Header from "./components/Header";

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
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="flex flex-col min-h-screen font-sans">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <CarCompanySlider/>
        <Footer />
      </body>

    </html>
  );
}
