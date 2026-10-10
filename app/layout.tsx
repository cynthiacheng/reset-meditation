import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC } from "next/font/google";
import localFont from "next/font/local";
import { SerwistProvider } from "@serwist/turbopack/react";
import "./globals.css";
import { BottomNav } from "@/components/nav/BottomNav";
import { VideoBackdrop } from "@/components/ui/VideoBackdrop";
import { FontSizeControl } from "@/components/ui/FontSizeControl";
import { FONT_SCALE_BLOCKING_SCRIPT } from "@/lib/fontScale";

const chenYuluoyan = localFont({
  src: "./fonts/ChenYuluoyan-2.0-Thin.ttf",
  variable: "--font-chenyuluoyan",
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reset｜靜心・書寫・指引",
  description: "為忙碌的你，留一段喘息的時間。主題式冥想、內在對話、原創牌卡指引。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Reset",
  },
  icons: {
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#161d17",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant-TW"
      className={`dark ${chenYuluoyan.variable} ${notoSansTC.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col font-body text-foreground antialiased">
        <script dangerouslySetInnerHTML={{ __html: FONT_SCALE_BLOCKING_SCRIPT }} />
        <VideoBackdrop />
        <FontSizeControl />
        <SerwistProvider swUrl="/serwist/sw.js" options={{ scope: "/" }}>
          <main className="mx-auto w-full max-w-md flex-1 pb-24 md:max-w-2xl">{children}</main>
          <BottomNav />
        </SerwistProvider>
      </body>
    </html>
  );
}
