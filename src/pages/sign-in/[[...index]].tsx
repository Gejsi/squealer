import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import Navbar from '../../components/Navbar'

const SignInPage = () => (
  <>
    <Navbar title='Sign In' />

    <div className='hero h-full'>
      <SignIn
        path='/sign-in'
        routing='path'
        signUpUrl='/sign-up'
        appearance={{
          baseTheme: dark,
          elements: {
            rootBox: 'w-full lg:w-1/2 flex justify-center',
            card: 'w-full',
          },
        }}
      />
    </div>
  </>
)

export default SignInPage
