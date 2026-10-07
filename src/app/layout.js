import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/loder/MobileBottomNav ";
import GlobalLoginModal from "@/modules/auth/components/GlobalLoginModal";
import ProfileCompletionHandler from "@/modules/auth/components/ProfileCompletionHandler";
import ScrollToTopButton from "@/modules/hotel/ScrollToTopButton";

import { getThemeServer } from "@/modules/theme/api/theme.service";
import { getThemeCSSVariables } from "@/modules/theme/theme.variables";

import "@/styles/cms-content.css";

import { App as AntdApp } from "antd";
import "antd/dist/reset.css";

import { Jost, Roboto } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";

import "./globals.css";
import AppProviders from "./providers";

import { metadata as siteMetadata } from "./metadata";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const dynamic = "force-dynamic";
export const metadata = siteMetadata;
export default async function RootLayout({ children }) {
  const theme = await getThemeServer();
  const themeVariables = getThemeCSSVariables(theme);

  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${roboto.variable} ${jost.variable} h-full antialiased`}
      style={themeVariables}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DYY7076V0W"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', 'G-DYY7076V0W');
          `}
        </Script>
      </head>

      <body className="flex min-h-full flex-col">
        <AppProviders>
          <Header />
          <ScrollToTopButton />
          <ProfileCompletionHandler />
          <main className="flex-1">
            <AntdApp>
              <GlobalLoginModal />
              {children}
            </AntdApp>
          </main>
          <Suspense fallback={null}>
            <BottomNav />
          </Suspense>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
