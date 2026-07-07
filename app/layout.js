import "./globals.css";

export const metadata = {
  title: "Pakistan TikTok Trends 🇵🇰",
  description: "Pakistan mein abhi kya trend kar raha hai — TikTok videos aur songs, live.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
