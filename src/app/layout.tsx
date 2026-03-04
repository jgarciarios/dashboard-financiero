import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinanzApp | El control total de tus finanzas",
  description: "Monitorea liquidez, presupuestos e inversiones en tiempo real, todo desde un único y poderoso panel de control.",
  openGraph: {
    title: "FinanzApp | El control total de tus finanzas",
    description: "Toma decisiones inteligentes basadas en datos. Tu panel financiero definitivo.",
    url: "https://dashboard-financiero-qilad6vmk.vercel.app",
    siteName: "FinanzApp",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinanzApp | El control total de tus finanzas",
    description: "Toma decisiones inteligentes basadas en datos. Tu panel financiero definitivo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
