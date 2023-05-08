import { SignUp } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import type { Page } from '../_app'

const SignUpPage: Page = () => (
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
)

SignUpPage.title = 'Sign Up'

export default SignUpPage
