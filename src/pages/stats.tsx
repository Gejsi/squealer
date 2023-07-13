import Image from 'next/image'
import { BiStats } from 'react-icons/bi'
import type { Page } from './_app'
import { useUser } from '@clerk/nextjs'
import Chart, { type ChartData } from '../components/Chart'
import { api } from '../utils/api'
import ErrorTemplate from '../components/ErrorTemplate'
import Spinner from '../components/Spinner'
import { useState } from 'react'

const Stats: Page = () => {
  const { user } = useUser()
  const [chartData, setChartData] = useState<ChartData>(undefined)

  const { data, isLoading, error, isError } = api.user.getStats.useQuery(
    undefined,
    {
      retry: false,
      refetchOnWindowFocus: false,
      onError() {
        setChartData(undefined)
      },
      onSuccess(data) {
        console.log(data.controversial / data.total)
        const controversialSqueals = {
          type: 'Controversial',
          percentage: (data.controversial / data.total) * 100,
        } as const

        const popularSqueals = {
          type: 'Popular',
          percentage: (data.popular / data.total) * 100,
        } as const

        const unpopularSqueals = {
          type: 'Unpopular',
          percentage: (data.unpopular / data.total) * 100,
        } as const

        setChartData([controversialSqueals, popularSqueals, unpopularSqueals])
      },
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
        <BiStats className='h-8 w-8 flex-shrink-0' />
        <span>Statistics about your squeals</span>
      </div>

      <div className='mb-12 mt-4 flex flex-col items-center justify-evenly gap-4 md:flex-row'>
        <div className='flex flex-col items-center gap-2'>
          <div className='avatar'>
            <div className='relative w-28'>
              {user?.profileImageUrl && (
                <Image
                  src={user?.profileImageUrl}
                  alt='User profile picture'
                  fill
                  className='rounded-full'
                />
              )}
            </div>
          </div>
          <p className='text-xl font-medium'>@{user?.username}</p>
        </div>

        <div className='flex max-w-full flex-col gap-4'>
          <div className='stats bg-base-200 shadow'>
            <div className='stat'>
              <div className='stat-title'>Reactions</div>
              <div className='stat-value text-lg'>{data.reactions}</div>
            </div>
            <div className='stat'>
              <div className='stat-title'>Replies</div>
              <div className='stat-value text-lg'>{data.replies}</div>
            </div>
            <div className='stat'>
              <div className='stat-title'>Impressions</div>
              <div className='stat-value text-lg'>{data.impressions}</div>
            </div>
          </div>

          <div className='stats bg-base-200 shadow'>
            <div className='stat'>
              <div className='stat-title'>Controversial</div>
              <div className='stat-value text-lg'>{data.controversial}</div>
            </div>
            <div className='stat'>
              <div className='stat-title'>Popular</div>
              <div className='stat-value text-lg'>{data.popular}</div>
            </div>
            <div className='stat'>
              <div className='stat-title'>Unpopular</div>
              <div className='stat-value text-lg'>{data.unpopular}</div>
            </div>
          </div>
        </div>
      </div>

      <div className='divider' />

      <Chart data={chartData} />
    </>
  )
}

Stats.title = 'Statistics'

export default Stats
