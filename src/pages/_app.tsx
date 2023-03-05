import '@/styles/globals.css'
import { SWRConfig } from "swr";
import fetchJson from "@/lib/fetchJson";
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      <Layout/>
      <Component {...pageProps} />
    </SWRConfig>
  );
}
