import { useRouter } from 'next/router'
import type { Page } from '../../_app'
import { api } from '../../../utils/api'
import ErrorTemplate from '../../../components/ErrorTemplate'
import Spinner from '../../../components/Spinner'
import Bubble from '../../../components/Bubble'
import { MdSend } from 'react-icons/md'
import { toast } from 'react-hot-toast'
import useSquealDialog from '../../../hooks/use-squeal-dialog'
import SquealDialog from '../../../components/editor/SquealDialog'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import Link from 'next/link'

const ChannelSqueal: Page = () => {
  const router = useRouter()
  const channelId = router.query.id as string
  const squealId = router.query.squealId as string
  const { openSquealDialog, closeSquealDialog } = useSquealDialog()
  const [autoAnimate] = useAutoAnimate()

  const {
    data: squeal,
    isLoading,
    isError,
    error,
  } = api.squeal.getFromChannel.useQuery(
    {
      channelId,
      squealId,
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  )

  const context = api.useContext()
  const { mutate: reply, isLoading: isReplying } = api.squeal.reply.useMutation(
    {
      onError() {
        toast.error('Unable to reply.')
      },
      onSuccess() {
        toast.success('Replied successfully.')
        closeSquealDialog()
      },
      onSettled() {
        context.squeal.getFromChannel.invalidate()
      },
    }
  )

  // TODO: improve UX with optimistic updates
  const { mutate: react } = api.squeal.react.useMutation({
    onError() {
      toast.error('Unable to react.')
    },
    onSuccess() {
      toast.success('Reacted successfully.')
    },
    onSettled() {
      context.squeal.getFromChannel.invalidate()
    },
  })

  if (isError)
    return (
      <ErrorTemplate
        message={error.message}
        statusCode={error.data?.httpStatus}
      />
    )

  if (isLoading) return <Spinner />

  return (
    <>
      <div className='mb-10 mt-8 flex items-center gap-4'>
        <MdSend className='h-8 w-8 flex-shrink-0' />
        <span>
          Checkout all this squeals' responses sent on{' '}
          <span className='link font-bold'>
            <Link href={'/channels/' + channelId}>§{squeal.channel.name}</Link>
          </span>
          .
        </span>
      </div>

      <div className='flex flex-col gap-4' ref={autoAnimate}>
        <Bubble
          squeal={squeal}
          impressions={squeal.impressions}
          likes={squeal.reactions.likes}
          dislikes={squeal.reactions.dislikes}
          replies={squeal.replies.length}
          reactionType={squeal.reactions.userReaction}
          onLike={() => react({ channelId, squealId, type: 'Like' })}
          onDislike={() => react({ channelId, squealId, type: 'Dislike' })}
          onReply={() => openSquealDialog({ id: channelId, type: 'channel' })}
        />

        {squeal.replies.map((response) => (
          <Bubble key={response.id} squeal={response} isResponse />
        ))}
      </div>

      <SquealDialog
        onCreate={(content, channelId) =>
          content && reply({ content, channelId, squealId })
        }
        isCreating={isReplying}
      />
    </>
  )
}

ChannelSqueal.title = 'Private squeal'

export default ChannelSqueal
