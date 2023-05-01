import { useAtom } from 'jotai'
import { ReactNode } from 'react'
import Sidebar, { sidebarAtom } from './Sidebar'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

const Layout = ({ children }: { children: ReactNode }) => {
  const [sidebarState] = useAtom(sidebarAtom)

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
        <main className='drawer-content flex flex-col p-4 pt-0 lg:p-16 lg:pt-0'>
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
