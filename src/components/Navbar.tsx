import { useAtom } from 'jotai'
import { sidebarAtom } from './Sidebar'
import { MdMenu } from 'react-icons/md'

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
  return (
    <nav className='sticky top-0 z-10 mb-4 bg-base-100 pt-4'>
      <div className='mb-6 flex items-center gap-4'>
        <MenuButton />
        <h1 className='flex-1 text-2xl md:text-4xl'>{title}</h1>
      </div>
      <div className='divider m-0 h-fit' />
    </nav>
  )
}

export default Navbar
