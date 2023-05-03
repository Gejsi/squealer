import { SignUp } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import Navbar from '../../components/Navbar'

const SignUpPage = () => (
  <>
    <Navbar title='Sign Up' />

    <div className='hero h-full'>
      <SignUp
        path='/sign-up'
        routing='path'
        signInUrl='/sign-in'
        appearance={{
          baseTheme: dark,
          elements: {
            rootBox: 'w-full lg:w-2/5 flex justify-center',
            card: 'w-full',
          },
        }}
      />
    </div>
  </>
)

export default SignUpPage
