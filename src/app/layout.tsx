import React from 'react';

// The root layout is required when using a root not-found.tsx.
// Since all our pages are within [locale], this layout just passes children through.
// The actual html/body tags are defined in [locale]/layout.tsx.
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
