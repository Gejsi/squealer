import { useAtom } from 'jotai'
import { sidebarAtom } from './Sidebar'
import { MdMenu } from 'react-icons/md'
import { UserButton, useUser } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import Link from 'next/link'
import { userMetadataAtom } from './Layout'

const MenuButton = () => {
  const [, setSidebarOpen] = useAtom(sidebarAtom)

  return (
    <label
      tabIndex={0}
      htmlFor='sidebar'
      className='btn-icon lg:hidden'
      onClick={() => setSidebarOpen(true)}
    >
      <MdMenu className='h-6 w-6' />
    </label>
  )
}

const Navbar = ({ title }: { title: string }) => {
  const { isSignedIn } = useUser()
  const [userMetadata] = useAtom(userMetadataAtom)

  return (
    <nav className='sticky top-0 z-10 mb-4 bg-base-100 pt-4'>
      <div className='mb-4 flex items-center gap-4 lg:mb-6'>
        <MenuButton />
        <h1 className='flex-1 text-2xl font-medium md:text-4xl'>{title}</h1>

        {isSignedIn ? (
          <>
            <Link href='/settings' className='hidden sm:inline-flex'>
              <span className='badge capitalize'>{userMetadata?.role}</span>
            </Link>
            <UserButton
              afterSignOutUrl='/'
              appearance={{
                baseTheme: dark,
                userProfile: { baseTheme: dark },
              }}
            />
          </>
        ) : (
          <Link href='/sign-in' className='btn-sm btn'>
            Sign in
          </Link>
        )}
      </div>
      <div className='divider m-0 h-fit' />
    </nav>
  )
}

export default Navbar
