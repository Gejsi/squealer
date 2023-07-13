import { useAutoAnimate } from '@formkit/auto-animate/react'
import { api } from '../../utils/api'
import type { Page } from '../_app'
import Bubble from '../../components/Bubble'
import Spinner from '../../components/Spinner'
import ErrorTemplate from '../../components/ErrorTemplate'
import { MdMood } from 'react-icons/md'

const Jokes: Page = () => {
  const [autoAnimate] = useAutoAnimate()

  const { data, isLoading, isError, error } = api.auto.getJokeSqueals.useQuery(
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
        <MdMood className='h-8 w-8 flex-shrink-0' />
        <span>Come everyday to look for some new jokes!</span>
      </div>

      <div className='flex flex-col gap-4' ref={autoAnimate}>
        {data.map((squeal) => (
          <Bubble key={squeal.id} squeal={squeal} />
        ))}
      </div>
    </>
  )
}

Jokes.title = 'Random jokes'

export default Jokes
