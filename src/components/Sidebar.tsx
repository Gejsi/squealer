import { useUser } from '@clerk/nextjs'
import { atom, useAtom } from 'jotai'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { TbDiamond } from 'react-icons/tb'
import { GiBirdTwitter } from 'react-icons/gi'
import { GiAxeSword } from 'react-icons/gi'
import {
  MdAllInbox,
  MdGroups,
  MdKeyboard,
  MdNotifications,
  MdPerson,
  MdShuffle,
  MdToday,
} from 'react-icons/md'
import { RiChatPrivateLine } from 'react-icons/ri'
import SquealDialog from './editor/SquealDialog'
import { userMetadataAtom } from './Layout'

export const sidebarAtom = atom(false)

const Sidebar = () => {
  const [, setSidebarOpen] = useAtom(sidebarAtom)
  const { isSignedIn } = useUser()
  const router = useRouter()
  const [userMetadata] = useAtom(userMetadataAtom)

  // close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [router.asPath, setSidebarOpen])

  const handleClick = () => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    setSidebarOpen(false)
  }

  return (
    <>
      <aside className='drawer-side'>
        <label
          htmlFor='sidebar'
          className='drawer-overlay'
          onClick={() => setSidebarOpen(false)}
        />
        <ul className='menu w-72 space-y-2 overflow-y-auto bg-base-200 p-4'>
          <nav className='flex flex-col items-center'>
            <Link href='/' className='flex items-center gap-2'>
              <GiBirdTwitter className='h-6 w-6' />
              <h1 className='text-4xl font-bold'>Squealer</h1>
            </Link>

            <div className='divider mb-0' />
          </nav>

          <div className='flex w-full items-center gap-2'>
            <li className='flex-1'>
              <Link href='/settings'>
                <div className='flex flex-1 items-center gap-2'>
                  <TbDiamond className='h-6 w-6' />
                  Daily Quota
                </div>
                <span className='text-sm'>
                  {userMetadata.quota} / {userMetadata.dailyQuotaLimit}
                </span>
              </Link>
            </li>
          </div>

          <li>
            <Link href='/users'>
              <MdPerson className='h-6 w-6' />
              Users
            </Link>
          </li>

          <li>
            <Link href='/notifications'>
              <MdNotifications className='h-6 w-6' />
              Notifications
            </Link>
          </li>

          <button className='btn-primary btn gap-2' onClick={handleClick}>
            <MdKeyboard className='h-6 w-6' />
            Write Squeal
          </button>

          <div className='divider' />

          <li className='menu-title'>
            <span className='uppercase'>Your chats</span>
          </li>

          <li>
            <Link href='/all'>
              <RiChatPrivateLine className='h-6 w-6' />
              Private chats
            </Link>
          </li>

          <li>
            <Link href='/all'>
              <MdGroups className='h-6 w-6' />
              Your channels
            </Link>
          </li>

          <div className='divider' />

          <li className='menu-title'>
            <span className='uppercase'>Public channels</span>
          </li>

          <li>
            <Link href='/all'>
              <MdAllInbox className='h-6 w-6' />
              All squeals
            </Link>
          </li>
          <li>
            <Link href='/controversial'>
              <GiAxeSword className='h-6 w-6' />
              Controversial
            </Link>
          </li>
          <li>
            <Link href='/news'>
              <MdToday className='h-6 w-6' />
              News
            </Link>
          </li>
          <li>
            <Link href='/random'>
              <MdShuffle className='h-6 w-6' />
              Random
            </Link>
          </li>
        </ul>
      </aside>
    </>
  )
}

export default Sidebar
