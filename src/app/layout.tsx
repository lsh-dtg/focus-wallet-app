import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Focus Wallet",
  description: "집중해서 번고, 원하는 휴식을 사는 집중 타이머",
  manifest: "./manifest.webmanifest",
  icons: { icon: "./icon.svg", apple: "./icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#6c63ff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body style={{margin:0}}>{children}</body></html>;
}
