import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const SignInPage = () => (
  <div className='hero h-full'>
    <SignIn
      path='/sign-in'
      routing='path'
      signUpUrl='/sign-up'
      appearance={{ baseTheme: dark }}
    />
  </div>
)

export default SignInPage
