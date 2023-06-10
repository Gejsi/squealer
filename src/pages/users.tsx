import Image from 'next/image'
import type { Page } from './_app'
import { api } from '../utils/api'
import type { FullUser } from '../types/user'
import { MdEdit } from 'react-icons/md'
import Link from 'next/link'
import { useAtom } from 'jotai'
import { squealDialogAtom } from '../components/editor/SquealDialog'

const UserCard = ({ user }: { user: FullUser }) => {
  const [, setReceiverData] = useAtom(squealDialogAtom)

  return (
    <div className='card gap-6 bg-base-200 p-8 shadow-lg'>
      <div className='relative h-24 w-24 self-center'>
        {user?.profileImageUrl && (
          <Image
            src={user?.profileImageUrl}
            alt='User profile picture'
            fill
            className='rounded-full'
          />
        )}
      </div>
      <div className='card-body p-0'>
        <h2 className='card-title self-center'>
          <Link href={`/users/${user.id}`} className='link-hover link'>
            @{user.username}
          </Link>
        </h2>
        <div className='stats shadow'>
          <div className='stat'>
            <div className='stat-title'>Role</div>
            <div className='stat-value text-xl'>{user.role}</div>
          </div>
          <div className='stat'>
            <div className='stat-title'>Quota remaining</div>
            <div className='stat-value text-xl'>{user.quota}</div>
          </div>
        </div>
        <div className='card-actions justify-center'>
          <button
            className='btn-outline btn mt-2 h-fit w-fit gap-2 py-2'
            onClick={() =>
              setReceiverData({ username: user.username, id: user.id })
            }
          >
            <MdEdit className='h-4 w-4' />
            Write Squeal
          </button>
        </div>
      </div>
    </div>
  )
}

const AllUsers: Page = () => {
  const { data: users } = api.user.getAll.useQuery()

  return (
    <div className='auto-fill grid gap-8'>
      {users?.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}

AllUsers.title = 'All users'

export default AllUsers
