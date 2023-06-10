import type { Page } from './_app'

const Home: Page = () => {
  return (
    <h1 className='text-6xl'>
      <span className='loading loading-spinner loading-xs'></span>
      <span className='loading loading-spinner loading-sm'></span>
      <span className='loading loading-spinner loading-md'></span>
      <span className='loading loading-spinner loading-lg'></span>
    </h1>
  )
}

Home.title = 'Home'

export default Home
