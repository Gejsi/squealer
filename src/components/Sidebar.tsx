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
              <Link href='/me'>
                <img className='w-7 rounded-full' alt='Avatar' />
              </Link>
            </li>
            <div className='tooltip' data-tip='Logout'>
              <button className='btn-icon'>
                <MdLogout className='h-6 w-6' />
              </button>
            </div>
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
