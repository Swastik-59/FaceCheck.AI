import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter, Noto_Sans } from 'next/font/google';

// Load Inter and Noto Sans fonts from Google Fonts
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-noto' });

export const metadata: Metadata = {
  title: 'FaceCheck.AI',
  description: 'Detect real vs AI-generated faces using deep learning',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSans.variable}`}>
      <body className="min-h-screen bg-white text-[#111418] antialiased">
        {children}
      </body>
    </html>
  );
}
