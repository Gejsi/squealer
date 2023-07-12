import { useAutoAnimate } from '@formkit/auto-animate/react'
import { api } from '../../utils/api'
import type { Page } from '../_app'
import Bubble from '../../components/Bubble'
import Spinner from '../../components/Spinner'
import ErrorTemplate from '../../components/ErrorTemplate'
import { MdHeartBroken } from 'react-icons/md'

const Controversial: Page = () => {
  const [autoAnimate] = useAutoAnimate()

  const { data, isLoading, isError, error } = api.squeal.getUnpopular.useQuery(
    undefined,
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
        <MdHeartBroken className='h-8 w-8 flex-shrink-0' />
        <span>All the unpopular squeals sent in different channels.</span>
      </div>

      <div className='flex flex-col gap-4' ref={autoAnimate}>
        {data.map((squeal) => (
          <Bubble
            key={squeal.id}
            squeal={squeal}
            href={'/channels/' + squeal.channelId + '/' + squeal.id}
          />
        ))}
      </div>
    </>
  )
}

Controversial.title = 'Unpopular topics'

export default Controversial
