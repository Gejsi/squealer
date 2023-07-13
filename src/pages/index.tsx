import Link from 'next/link'
import type { Page } from './_app'
import Image from 'next/image'

const Home: Page = () => {
  return (
    <section className='flex h-full flex-col justify-center gap-8 md:flex-row md:items-center'>
      <div className='prose w-full md:prose-xl lg:w-1/2'>
        <h1>
          The most{' '}
          <span className='bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent'>
            controversial
          </span>{' '}
          social media platform
        </h1>

        <p>
          As Twitter's and Reddit's influence fades,{' '}
          <span className='bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent'>
            Squealer
          </span>{' '}
          emerges as a dynamic platform, ready to redefine how we connect,
          engage, and share our lives. Experience the freedom to express
          yourself, connect with like-minded individuals, and make your voice
          heard in a digital realm driven by genuine interactions.
        </p>

        <div className='flex w-full justify-center'>
          <Link href='/public/all' className='btn-primary btn md:btn-lg'>
            Checkout some squeals
          </Link>
        </div>
      </div>

      <div className='relative hidden h-3/5 w-1/2 lg:block'>
        <Image
          src='/logo.png'
          alt='Squealer logo'
          fill
          className='mask mask-hexagon w-1/2 object-contain'
        />
      </div>
    </section>
  )
}

Home.title = 'Home'

export default Home
