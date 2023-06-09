import { useRouter } from 'next/router'
import type { Page } from '../../_app'
import { api } from '../../../utils/api'
import ErrorTemplate from '../../../components/ErrorTemplate'
import Spinner from '../../../components/Spinner'
import Bubble from '../../../components/Bubble'
import { MdSend } from 'react-icons/md'
import { toast } from 'react-hot-toast'
import useSquealDialog from '../../../hooks/use-squeal-dialog'
import SquealDialog, {
  editorLengthAtom,
} from '../../../components/editor/SquealDialog'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useAtomValue } from 'jotai'
import JoinTemplate from '../../../components/JoinTemplate'

const ChannelSqueal: Page = () => {
  const router = useRouter()
  const channelId = router.query.id as string
  const squealId = router.query.squealId as string
  const contentLength = useAtomValue(editorLengthAtom)
  const { openSquealDialog, closeSquealDialog } = useSquealDialog()
  const [autoAnimate] = useAutoAnimate()
  const { user } = useUser()

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

  const { mutate: react } = api.squeal.react.useMutation({
    async onMutate(input) {
      await context.squeal.getFromChannel.cancel({ channelId, squealId })

      const prevData = context.squeal.getFromChannel.getData({
        channelId,
        squealId,
      })

      if (prevData && user) {
        context.squeal.getFromChannel.setData({ channelId, squealId }, () => {
          // eslint-disable-next-line prefer-const
          let { likesCount, dislikesCount, userReactionType } =
            prevData.properties

          if (input.type === 'Like') {
            if (!userReactionType || userReactionType === 'Dislike')
              likesCount++
            if (userReactionType === 'Dislike') dislikesCount--
          } else if (input.type === 'Dislike') {
            if (!userReactionType || userReactionType === 'Like')
              dislikesCount++
            if (userReactionType === 'Like') likesCount--
          }

          return {
            ...prevData,
            properties: {
              likesCount,
              dislikesCount,
              userReactionType: input.type,
            },
          }
        })
      }

      return { prevData }
    },
    onError(_err, _input, snapshot) {
      toast.error('Unable to react.')

      if (snapshot?.prevData)
        context.squeal.getFromChannel.setData(
          { channelId, squealId },
          snapshot.prevData
        )
    },
    onSettled() {
      context.squeal.getFromChannel.invalidate({ channelId, squealId })
    },
  })

  if (isError)
    if (error.data && error.data.code === 'UNAUTHORIZED')
      return <JoinTemplate channelId={channelId} invalidate='squeal' />
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
          likes={squeal.properties.likesCount}
          dislikes={squeal.properties.dislikesCount}
          replies={squeal.replies.length}
          reactionType={squeal.properties.userReactionType}
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
          content && reply({ content, channelId, squealId, contentLength })
        }
        isCreating={isReplying}
      />
    </>
  )
}

ChannelSqueal.title = 'Private squeal'

export default ChannelSqueal
