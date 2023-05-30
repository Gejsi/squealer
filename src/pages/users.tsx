import Image from 'next/image'
import type { Page } from './_app'
import { api } from '../utils/api'
import type { FullUser } from '../types/user'
import { MdEdit } from 'react-icons/md'

const UserCard = ({ user }: { user: FullUser }) => {
  console.log(user)
  return (
    <div className='card gap-8 bg-base-200 p-8 shadow-lg lg:card-side'>
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
        <h2 className='card-title'>
          {user.username || user.emailAddresses[0]?.emailAddress}
        </h2>
        <p>{user.role}</p>
        <div className='card-actions justify-center lg:justify-end'>
          <button className='btn-outline btn gap-x-2'>
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
