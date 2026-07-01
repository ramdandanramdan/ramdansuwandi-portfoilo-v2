import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/landing/ThemeProvider";

export const metadata: Metadata = {
  title: "Ramdan Suwandi - Portfolio",
  description: "Full Stack Web Developer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
