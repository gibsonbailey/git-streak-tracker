import { AppProps } from 'next/app'
import { Inter } from '@next/font/google'

import '../styles/global.css'

const inter = Inter({subsets: ['latin']})

export default function App({ Component, pageProps }: AppProps) {
    return (
        <main
            className={inter.className}
        >
            <Component {...pageProps} />
        </main>
    )
}