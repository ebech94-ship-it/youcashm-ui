import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";

export const metadata = {
  title: "youCashM",
  description: "Crash game platform",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}