import { atom, useAtom } from 'jotai'
import Head from 'next/head'
import type { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import Sidebar, { sidebarAtom } from './Sidebar'
import type { UserMetadata } from '../schemas/user-metadata'
import { api } from '../utils/api'

export const publicMetadataAtom = atom<UserMetadata>({
  role: 'Regular',
  quota: 0,
  dailyQuotaLimit: 0,
  weeklyQuotaLimit: 0,
  monthlyQuotaLimit: 0,
})

const Layout = ({ children }: { children: ReactNode }) => {
  const [sidebarState] = useAtom(sidebarAtom)
  const [, setPublicMetadata] = useAtom(publicMetadataAtom)

  api.userMetadata.get.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    onSuccess(data) {
      setPublicMetadata(data)
    },
  })

  return (
    <>
      <Head>
        <title>Squealer</title>
      </Head>

      <div className='drawer-mobile drawer min-h-screen'>
        <input
          id='sidebar'
          type='checkbox'
          className='drawer-toggle'
          checked={sidebarState}
          readOnly
        />

        <main className='drawer-content flex flex-col p-4 pt-0 lg:p-16 lg:pt-0 xl:p-32 xl:pt-0'>
          {children}
        </main>

        <Sidebar />

        <Toaster
          position='bottom-right'
          containerClassName='!inset-4 md:!inset-8'
          gutter={16}
          toastOptions={{ className: 'notification' }}
        />
      </div>
    </>
  )
}

export default Layout
