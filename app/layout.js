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
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="Merge PDF, split PDF, combine PDF, extract PDF, compress PDF, convert PDF, Word to PDF, Excel to PDF, Powerpoint to PDF, PDF to JPG, JPG to PDF"></meta>
        <meta name="author" content="FriendlyPDF Team"></meta>
        <meta name="description" content="FriendlyPDF is a free online tool to convert, merge, split, compress and edit your PDF files easily."></meta>
        </head>
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
