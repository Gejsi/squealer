import { api } from '../utils/api'
import type { Page } from './_app'

const Home: Page = () => {
  const hello = api.example.hello.useQuery({ text: 'from tRPC' })

  return <h1 className='text-6xl'>Home page</h1>
}

Home.title = 'Feed'

export default Home
