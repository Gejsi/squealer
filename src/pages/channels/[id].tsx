import { useRouter } from 'next/router'
import Image from 'next/image'
import { api } from '../../utils/api'
import type { Page } from '../_app'
import ErrorTemplate from '../../components/ErrorTemplate'
import Spinner from '../../components/Spinner'
import { toast } from 'react-hot-toast'
import { cn } from '../../utils/misc'
import { MdEdit } from 'react-icons/md'
import SquealDialog from '../../components/editor/SquealDialog'
import useSquealDialog from '../../hooks/use-squeal-dialog'
import Bubble from '../../components/Bubble'
import { useAutoAnimate } from '@formkit/auto-animate/react'

const Channel: Page = () => {
  const channelId = useRouter().query.id as string
  const { openSquealDialog, closeSquealDialog } = useSquealDialog()
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
  const { mutate: joinChannel, isLoading: isJoining } =
    api.channel.join.useMutation({
      onError() {
        toast.error('Unable to join channel.')
      },
      onSuccess(data) {
        toast.success(`${data.name} joined successfully.`)
      },
      onSettled() {
        context.channel.get.invalidate()
      },
    })

  const { mutate: createSqueal, isLoading: isCreating } =
    api.chat.createNewSqueal.useMutation({
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
      return (
        <div className='hero h-full'>
          <div className='rounded-xl bg-base-200 p-8 md:mx-auto md:w-9/12'>
            <h1 className='text-xl font-bold md:text-3xl'>
              You are not a member of this channel yet.
            </h1>
            <p className='mb-8 text-lg'>Would you like to join?</p>
            <button
              className={cn('btn', {
                loading: isJoining,
              })}
              onClick={() => joinChannel({ channelId })}
            >
              Join
            </button>
          </div>
        </div>
      )
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
              <div className='stat-title'>Members count</div>
              <div className='stat-value text-lg'>{data.members.length}</div>
            </div>
            <div className='stat'>
              <div className='stat-title'>Squeals count</div>
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
            href={'/squeals/' + squeal.id}
          />
        ))}
      </div>

      <SquealDialog
        onCreate={(content, selectedChannelId) =>
          content && createSqueal({ content, channelId: selectedChannelId })
        }
        isCreating={isCreating}
      />
    </>
  )
}

Channel.title = 'Private channel'

export default Channel
