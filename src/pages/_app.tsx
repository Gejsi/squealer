import { type AppType } from 'next/app'
import { ClerkProvider } from '@clerk/nextjs'
import { api } from '../utils/api'

import '../styles/globals.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Layout from '../components/Layout'

const App: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Layout>
        <Component {...pageProps} />
      </Layout>

      <ReactQueryDevtools initialIsOpen={false} />
    </ClerkProvider>
  )
}

export default api.withTRPC(App)
