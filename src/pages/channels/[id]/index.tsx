import { useRouter } from 'next/router'
import Image from 'next/image'
import { api } from '../../../utils/api'
import type { Page } from '../../_app'
import ErrorTemplate from '../../../components/ErrorTemplate'
import Spinner from '../../../components/Spinner'
import { toast } from 'react-hot-toast'
import { MdEdit } from 'react-icons/md'
import SquealDialog, {
  editorLengthAtom,
} from '../../../components/editor/SquealDialog'
import useSquealDialog from '../../../hooks/use-squeal-dialog'
import Bubble from '../../../components/Bubble'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useAtomValue } from 'jotai'
import JoinTemplate from '../../../components/JoinTemplate'

const Channel: Page = () => {
  const router = useRouter()
  const channelId = router.query.id as string
  const { openSquealDialog, closeSquealDialog } = useSquealDialog()
  const contentLength = useAtomValue(editorLengthAtom)
  const [autoAnimate] = useAutoAnimate()

  const { data, isLoading, isError, error } = api.channel.get.useQuery(
    {
      channelId,
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  )

  const context = api.useContext()

  const { mutate: createSqueal, isLoading: isCreating } =
    api.squeal.create.useMutation({
      onError() {
        toast.error('Unable to send squeal.')
      },
      onSuccess() {
        toast.success('Squeal successfully sent.')
        closeSquealDialog()
      },
      onSettled() {
        context.channel.get.invalidate()
      },
    })

  if (isError)
    if (error.data && error.data.code === 'UNAUTHORIZED')
      return <JoinTemplate channelId={channelId} invalidate='channel' />
    else
      return (
        <ErrorTemplate
          message={error.message}
          statusCode={error.data?.httpStatus}
        />
      )

  if (isLoading) return <Spinner />

  return (
    <>
      <div className='my-8 flex flex-col items-center justify-around gap-4 md:flex-row'>
        <div className='flex flex-col items-center gap-2'>
          <div className='avatar-group -space-x-10'>
            {data.members.slice(0, 3).map((member) => (
              <div className='avatar' key={member.id}>
                <div className='relative w-14 md:w-20'>
                  <Image
                    src={member.profileImageUrl}
                    alt='User profile picture'
                    fill
                  />
                </div>
              </div>
            ))}
          </div>
          <p className='text-xl font-medium'>§{data.name}</p>
        </div>

        <div className='flex max-w-full flex-col gap-4'>
          <div className='stats bg-base-200 shadow'>
            <div className='stat'>
              <div className='stat-title'>Owner</div>
              <div className='stat-value text-lg'>@{data.owner.username}</div>
            </div>
            <div className='stat'>
              <div className='stat-title'>Members</div>
              <div className='stat-value text-lg'>{data.members.length}</div>
            </div>
            <div className='stat'>
              <div className='stat-title'>Squeals</div>
              <div className='stat-value text-lg'>{data.squeals.length}</div>
            </div>
          </div>

          <button
            className='btn-primary btn h-fit w-fit gap-2 self-center'
            onClick={() => openSquealDialog({ id: channelId, type: 'channel' })}
          >
            <MdEdit className='h-4 w-4' />
            Write New Squeal
          </button>
        </div>
      </div>

      <div className='divider' />

      <div className='flex flex-col gap-4' ref={autoAnimate}>
        {data.squeals.map((squeal) => (
          <Bubble
            key={squeal.id}
            squeal={squeal}
            href={channelId + '/' + squeal.id}
          />
        ))}
      </div>

      <SquealDialog
        onCreate={(content, selectedChannelId) =>
          content &&
          createSqueal({
            content,
            channelId: selectedChannelId,
            contentLength,
          })
        }
        isCreating={isCreating}
      />
    </>
  )
}

Channel.title = 'Private channel'

export default Channel
