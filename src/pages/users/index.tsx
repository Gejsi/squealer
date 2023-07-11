import Image from 'next/image'
import type { Page } from '../_app'
import { type RouterOutputs, api } from '../../utils/api'
import { MdEdit, MdPerson2 } from 'react-icons/md'
import Link from 'next/link'
import SquealDialog from '../../components/editor/SquealDialog'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'
import Spinner from '../../components/Spinner'
import ErrorTemplate from '../../components/ErrorTemplate'
import useSquealDialog from '../../hooks/use-squeal-dialog'
import { useUser } from '@clerk/nextjs'

const UserCard = ({ user }: { user: RouterOutputs['user']['getAll'][0] }) => {
  const { user: authedUser, isSignedIn } = useUser()
  const { openSquealDialog } = useSquealDialog()

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
          <Link href={`/users/${user.username}`} className='link-hover link'>
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
          {isSignedIn && (
            <button
              className='btn-outline btn mt-2 h-fit w-fit gap-2 py-2'
              disabled={authedUser.id === user.id}
              onClick={() =>
                user.username &&
                openSquealDialog({
                  username: user.username,
                  id: user.id,
                  type: 'chat',
                })
              }
            >
              <MdEdit className='h-4 w-4' />
              Write Squeal
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const AllUsers: Page = () => {
  const router = useRouter()
  const { closeSquealDialog } = useSquealDialog()

  const {
    data: users,
    isLoading,
    error,
    isError,
  } = api.user.getAll.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  })

  const { mutate: createSqueal, isLoading: isCreating } =
    api.chat.create.useMutation({
      onError() {
        toast.error('Unable to create squeal.')
      },
      onSuccess(data) {
        toast.success('Squeal has been sent.')
        closeSquealDialog()
        router.push('/chats/' + data.channelId)
      },
    })

  if (isError)
    return (
      <ErrorTemplate
        message={error.message}
        statusCode={error.data?.httpStatus}
      />
    )

  return (
    <>
      <div className='mb-10 mt-8 flex items-center gap-4'>
        <MdPerson2 className='h-8 w-8 flex-shrink-0' />
        <span>Look for some friends.</span>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className='auto-fill grid gap-8'>
          {users?.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}

      <SquealDialog
        onCreate={(content, receiverId) =>
          content && createSqueal({ content, receiverId })
        }
        isCreating={isCreating}
      />
    </>
  )
}

AllUsers.title = 'All users'

export default AllUsers
