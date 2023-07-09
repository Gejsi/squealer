import { useRouter } from 'next/router'
import type { Page } from '../../_app'
import { api } from '../../../utils/api'
import ErrorTemplate from '../../../components/ErrorTemplate'
import Spinner from '../../../components/Spinner'
import Bubble from '../../../components/Bubble'
import { MdSend } from 'react-icons/md'

const ChannelSqueal: Page = () => {
  const router = useRouter()
  const channelId = router.query.id as string
  const squealId = router.query.squealId as string

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
          <span className='font-bold'>§{squeal.channel.name}</span>.
        </span>
      </div>

      <div className='flex flex-col gap-4'>
        <Bubble
          squeal={squeal}
          onLike={() => console.log('liked')}
          onDislike={() => console.log('disliked')}
          onReply={() => console.log('replied')}
          impressions={0}
        />

        {/* <Bubble squeal={squeal} isResponse /> */}
      </div>
    </>
  )
}

ChannelSqueal.title = 'Private squeal'

export default ChannelSqueal
