import { atom, useAtom } from 'jotai'
import Link from 'next/link'
import {
  MdDashboard,
  MdKeyboard,
  MdLogout,
  MdSettings,
  MdToday,
} from 'react-icons/md'
import { BiCommand } from 'react-icons/bi'
import { GiBirdTwitter } from 'react-icons/gi'
import { UserButton } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { RiCoinLine } from 'react-icons/ri'

export const sidebarAtom = atom(false)

const Sidebar = () => {
  const [, setSidebarOpen] = useAtom(sidebarAtom)

  return (
    <aside className='drawer-side'>
      <label
        htmlFor='sidebar'
        className='drawer-overlay'
        onClick={() => setSidebarOpen(false)}
      />
      <ul className='menu w-64 space-y-2 overflow-y-auto bg-base-200 p-4'>
        <nav className='flex flex-col items-center'>
          <Link href='/' className='flex items-center gap-2'>
            <GiBirdTwitter className='h-6 w-6' />
            <h1 className='text-4xl font-bold'>Squealer</h1>
          </Link>

          <div className='divider mb-0' />

          <div className='flex w-full items-center gap-2'>
            <li className='flex-1'>
              <Link href='chars'>
                <div className='flex flex-1 items-center gap-2'>
                  <RiCoinLine className='h-5 w-5' />
                  Characters
                </div>
                <span>500</span>
              </Link>
            </li>
          </div>
        </nav>
        <button className='btn-primary btn gap-2 normal-case'>
          <MdKeyboard className='h-6 w-6' />
          Write Squeal
        </button>

        <div className='divider' />

        <li className='menu-title'>
          <span className='uppercase'>Sections</span>
        </li>

        <li>
          <Link href='/decks'>
            <MdDashboard className='h-6 w-6' />
            Decks
          </Link>
        </li>
        <li>
          <Link href='/question'>
            <MdToday className='h-6 w-6' />
            Today's question
          </Link>
        </li>
        <li>
          <Link href='/settings'>
            <MdSettings className='h-6 w-6' />
            Settings
          </Link>
        </li>
        <li>
          <button>
            <BiCommand className='h-5 w-5' />
            Shortcuts
          </button>
        </li>

        <div className='divider' />

        <li className='menu-title'>
          <span className='uppercase'>Folders</span>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
