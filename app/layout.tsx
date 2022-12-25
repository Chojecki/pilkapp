"use client";

import { Montserrat } from "@next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PageWrapper from "../components/page-wrapper";
import { AuthContextProvider } from "../context/auth-context";

import "../styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchInterval: false,
    },
  },
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
});

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>
            <PageWrapper>{children}</PageWrapper>
          </AuthContextProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
