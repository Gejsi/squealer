import { atom, useAtom, useSetAtom } from 'jotai'
import Head from 'next/head'
import { type ReactNode, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Sidebar, { sidebarAtom } from './Sidebar'
import type { UserMetadata } from '../schemas/user-metadata'
import { api } from '../utils/api'
import { useUser } from '@clerk/nextjs'

export const userMetadataAtom = atom<UserMetadata | undefined>(undefined)

const Layout = ({ children }: { children: ReactNode }) => {
  const [sidebarState] = useAtom(sidebarAtom)
  const setUserMetadata = useSetAtom(userMetadataAtom)
  const { isSignedIn } = useUser()

  api.user.getMetadata.useQuery(undefined, {
    retry: isSignedIn,
    refetchOnWindowFocus: false,
    onError() {
      setUserMetadata(undefined)
    },
    onSuccess(data) {
      setUserMetadata(data)
    },
  })

  // set initial metadata after logout
  useEffect(() => {
    if (!isSignedIn) setUserMetadata(undefined)
  }, [isSignedIn, setUserMetadata])

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
          position='top-center'
          containerClassName='!inset-4 md:!inset-8'
          gutter={16}
          toastOptions={{ className: 'notification' }}
        />
      </div>
    </>
  )
}

export default Layout
