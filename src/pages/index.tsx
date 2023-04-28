import { type NextPage } from 'next'
import { api } from '../utils/api'
import Navbar from '../components/Navbar'

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: 'from tRPC' })

  return (
    <>
      <Navbar title='Feed' />

      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
      <h1 className='text-6xl'>Squealer</h1>
    </>
  )
}

export default Home
