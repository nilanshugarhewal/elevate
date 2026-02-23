import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "Track your progress and tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
