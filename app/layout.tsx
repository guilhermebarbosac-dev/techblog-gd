import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";
import TEXTS from "./constants/texts";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";

const newsReaderSans = Newsreader({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-newsreader-sans",
});

const newsReaderMono = Newsreader({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-newsreader-mono",
});

export const metadata: Metadata = {
  title: TEXTS.appName,
  description: TEXTS.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${newsReaderSans.variable} ${newsReaderMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster position="top-right" toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }} />
        </AuthProvider>
      </body>
    </html>
  );
}
