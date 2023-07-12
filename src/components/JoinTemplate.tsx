import { api } from '../utils/api'
import { toast } from 'react-hot-toast'
import { cn } from '../utils/misc'

const JoinTemplate = ({
  channelId,
  invalidate,
}: {
  channelId: string
  invalidate: 'channel' | 'squeal'
}) => {
  const context = api.useContext()
  const { mutate: joinChannel, isLoading: isJoining } =
    api.channel.join.useMutation({
      onError() {
        toast.error('Unable to join channel.')
      },
      onSuccess(data) {
        toast.success(`§${data.name} joined successfully.`)
      },
      onSettled() {
        if (invalidate === 'channel')
          context.channel.get.invalidate({ channelId })
        else if (invalidate === 'squeal')
          context.squeal.getFromChannel.invalidate()
      },
    })

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
}

export default JoinTemplate
