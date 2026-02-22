import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import { cn } from "@/lib/utils";
import { LanguageProvider } from './i18n/provider';
import { LanguageSwitcher } from './i18n/switcher';
import "./globals.css";

export const metadata: Metadata = {
  title: "Convo | Language Learning",
  description: "Speech focused language learning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body
        className={cn(
          "grainy flex min-h-screen flex-col font-sans antialiased",
          GeistSans.className,
        )}
      >
        <LanguageProvider defaultLocale="en" availableLocales={['en', 'fr', 'ar', 'ja']}>
        {children}
        <LanguageSwitcher />
      </LanguageProvider>
      </body>
    </html>
  );
}
