import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RAW Network — Content Pipeline",
  description:
    "Approval and content management pipeline for the RAW Network.",
  applicationName: "RAW Network",
  keywords: ["RAW Network", "content pipeline", "approval workflow"],
  robots: "noindex, nofollow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <div className="flex min-h-dvh flex-col">
          <header
            role="banner"
            className="border-b border-border px-4 py-3 sm:px-6"
          >
            <nav aria-label="Primary navigation">
              <span className="text-lg font-semibold text-on-surface">
                RAW Network
              </span>
            </nav>
          </header>
          <main id="main-content" role="main" className="flex-1">
            {children}
          </main>
          <footer
            role="contentinfo"
            className="border-t border-border px-4 py-4 text-sm text-on-surface-muted sm:px-6"
          >
            <p>&copy; {new Date().getFullYear()} RAW Network</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
