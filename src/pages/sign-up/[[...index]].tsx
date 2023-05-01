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
        appearance={{ baseTheme: dark }}
      />
    </div>
  </>
)

export default SignUpPage
