import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interview Product and Category - Modern Data Layer",
  description: "Frontend with modern data layer architecture for interview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          <div className="flex h-screen bg-gray-50 text-gray-900">
          {children}
        </div>
        </div>
      </body>
    </html>
  );
}
