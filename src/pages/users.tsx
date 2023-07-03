import Image from 'next/image'
import type { Page } from './_app'
import { type RouterOutputs, api } from '../utils/api'
import { MdEdit } from 'react-icons/md'
import Link from 'next/link'
import { useSetAtom } from 'jotai'
import SquealDialog, {
  editorLengthAtom,
} from '../components/editor/SquealDialog'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'
import Spinner from '../components/Spinner'
import ErrorTemplate from '../components/ErrorTemplate'
import useSquealDialog from '../hooks/use-squeal-dialog'

const UserCard = ({ user }: { user: RouterOutputs['user']['getAll'][0] }) => {
  const { openDialog } = useSquealDialog()

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
              user.username &&
              openDialog({ username: user.username, id: user.id, type: 'chat' })
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
  const router = useRouter()
  const { closeDialog } = useSquealDialog()
  const setEditorLength = useSetAtom(editorLengthAtom)

  const { data: users, isLoading, error, isError } = api.user.getAll.useQuery()

  const { mutate: createSqueal, isLoading: isCreating } =
    api.chat.create.useMutation({
      onError() {
        toast.error('Unable to create squeal.')
      },
      onSuccess(data) {
        toast.success('Squeal has been created.')
        closeDialog()
        setEditorLength(0)
        router.push('/chats/' + data.channelId)
      },
    })

  if (isError)
    return (
      <ErrorTemplate
        message='Error while fetching chats'
        statusCode={error.data?.httpStatus}
      />
    )

  return (
    <>
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
