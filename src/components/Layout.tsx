import { atom, useAtom } from 'jotai'
import { type ReactNode, useEffect } from 'react'
import Sidebar, { sidebarAtom } from './Sidebar'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import { useUser } from '@clerk/nextjs'

export const publicMetadataAtom = atom<UserPublicMetadata>({
  role: 'regular',
  quota: 500,
  quotaLimit: 500,
})

const Layout = ({ children }: { children: ReactNode }) => {
  const [sidebarState] = useAtom(sidebarAtom)
  const { user } = useUser()
  const [, setPublicMetadata] = useAtom(publicMetadataAtom)

  useEffect(() => {
    if (user?.publicMetadata) setPublicMetadata(user.publicMetadata)
  }, [user?.publicMetadata, setPublicMetadata])

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
          position='top-right'
          containerClassName='!inset-4 md:!inset-8'
          gutter={16}
          toastOptions={{ className: 'notification' }}
        />
      </div>
    </>
  )
}

export default Layout
