import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import type { Page } from '../_app'

const SignInPage: Page = () => (
  <div className='hero h-full'>
    <SignIn
      path='/sign-in'
      routing='path'
      signUpUrl='/sign-up'
      afterSignInUrl='/auth-confirmation'
      afterSignUpUrl='/auth-confirmation'
      appearance={{
        baseTheme: dark,
        elements: {
          rootBox: 'w-full lg:w-3/5 xl:w-2/5 flex justify-center',
          card: 'w-full',
        },
      }}
    />
  </div>
)

SignInPage.title = 'Sign In'

export default SignInPage
