import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { WalletContextProvider } from "@/context/WalletContext";
import { useRouter } from 'next/router';

import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const path = router.asPath;
  const isSignedIn = ['/dashboard', 'attest'].includes(path)

  return (
    <>
      <WalletContextProvider>
        <div className="bg-bg text-white text-lg font-medium">
          <Navbar isSignedIn={isSignedIn} />
          <main className="min-h-[calc(100vh-64px)]">
            <div className="mx-auto p-4 xl:container lg:px-16 xl:px-20 md:p-8 pt-8">
              <Component {...pageProps} />
            </div>
          </main>
        </div>
      </WalletContextProvider>
    </>
  );
}
