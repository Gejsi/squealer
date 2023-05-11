import Head from 'next/head'
import Link from 'next/link'

const ErrorTemplate = ({
  message,
  statusCode = 500,
}: {
  message: string
  statusCode?: number
}) => (
  <>
    <Head>
      <title>Squealer &#x2022; Error {statusCode}</title>
    </Head>

    <div className='hero h-full'>
      <div className='rounded-xl bg-error p-8 text-error-content md:mx-auto md:w-9/12'>
        <p className='text-lg'>({statusCode})</p>
        <h1 className='mb-8 text-xl font-bold md:text-3xl'>
          {statusCode === 500
            ? 'Internal Server Error. Please, try again later.'
            : message}
        </h1>
        <Link href='/' className='btn'>
          Go home
        </Link>
      </div>
    </div>
  </>
)

export default ErrorTemplate
