import React from 'react';

// This is the root layout that wraps the root page (the redirect).
// The main application layout is located at src/app/[locale]/layout.tsx.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
