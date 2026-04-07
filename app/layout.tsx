import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { Suspense } from 'react';
import { ReferralTracker } from "@/components/ReferralTracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Veloprome | 1,000+ AI Prompts",
  description: "Unlock 1,000+ premium AI prompts for ChatGPT, Claude, and Gemini. IDR 8,000 one-time access.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${instrumentSerif.variable} ${jakartaSans.variable}`}>
        <head>
          {/* TikTok Pixel Code Start */}
          <Script id="tiktok-pixel" strategy="afterInteractive">
            {`
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
                var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
                ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

                ttq.load('D77O1I3C77U7F63B8DDG');
                ttq.page();
              }(window, document, 'ttq');
            `}
          </Script>
          {/* TikTok Pixel Code End */}
          <Script 
            async 
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5739160252356689"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        </head>
        <body style={{ margin: 0, fontFamily: "'Geist', system-ui, sans-serif", background: "#fff", color: "#111" }}>
          <Suspense fallback={null}>
            <ReferralTracker />
          </Suspense>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}