import { useRouter } from 'next/router'
import { api } from '../../utils/api'
import type { Page } from '../_app'
import ErrorTemplate from '../../components/ErrorTemplate'
import Spinner from '../../components/Spinner'

const Channel: Page = () => {
  const channelId = useRouter().query.id as string

  const { data, isLoading, isError, error } = api.channel.get.useQuery(
    {
      channelId,
    },
    {
      retry: false,
    }
  )

  if (isError)
    if (error.data && error.data.code === 'UNAUTHORIZED')
      return (
        <div className='hero h-full'>
          <div className='rounded-xl bg-base-200 p-8 md:mx-auto md:w-9/12'>
            <h1 className='text-xl font-bold md:text-3xl'>
              You are not a member of this channel yet.
            </h1>
            <p className='mb-8 text-lg'>Would you like to join?</p>
            <button className='btn'>Join</button>
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

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className='flex flex-col gap-4'>{data?.name}</div>
      )}
    </>
  )
}

Channel.title = 'Private channel'

export default Channel
