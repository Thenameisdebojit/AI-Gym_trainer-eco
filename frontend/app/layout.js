export const metadata = {
  title: "AI Fitness Assistant",
  description: "AI-powered fitness tracking and coaching",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
