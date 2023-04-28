import { SignUp } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const SignUpPage = () => (
  <div className='hero h-full'>
    <SignUp
      path='/sign-up'
      routing='path'
      signInUrl='/sign-in'
      appearance={{ baseTheme: dark }}
    />
  </div>
)

export default SignUpPage
