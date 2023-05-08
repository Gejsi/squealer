import type { AppProps } from 'next/app'
import { ClerkProvider } from '@clerk/nextjs'
import { api } from '../utils/api'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Layout from '../components/Layout'
import type { NextPage } from 'next'
import Navbar from '../components/Navbar'
import '../styles/globals.css'

export type Page = NextPage & { title: string }

type AppWithNavbar = AppProps & {
  Component: Page
}

const App = ({ Component, pageProps }: AppWithNavbar) => {
  return (
    <ClerkProvider {...pageProps}>
      <Layout>
        <Navbar title={Component.title} />
        <Component {...pageProps} />
      </Layout>

      <ReactQueryDevtools initialIsOpen={false} />
    </ClerkProvider>
  )
}

export default api.withTRPC(App)
