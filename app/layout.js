import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarPage from "./(components)/navbar/page";
import FooterPage from "./(components)/footer/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "File Formater",
  description: "Convert your files easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavbarPage/>
        {children}
        <FooterPage/>
      </body>
    </html>
  );
}
