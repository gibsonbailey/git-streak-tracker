import { AppProps } from 'next/app'
import { Inter } from '@next/font/google'

import '../styles/global.css'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                {/* Add the favicon */}
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            <main
                className={inter.className}
            >
                <Component {...pageProps} />
            </main>
        </>
    )
}