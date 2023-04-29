import { useAtom } from 'jotai'
import { ReactNode } from 'react'
import Sidebar, { sidebarAtom } from './Sidebar'
import Head from 'next/head'

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
        <main className='drawer-content p-4 pt-0 lg:p-16 lg:pt-0'>
          {children}
        </main>
        <Sidebar />
      </div>
    </>
  )
}

export default Layout
