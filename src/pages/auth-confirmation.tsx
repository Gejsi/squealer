import type { Page } from './_app'
import { api } from '../utils/api'
import { useRouter } from 'next/router'
import ErrorTemplate from '../components/ErrorTemplate'
import Spinner from '../components/Spinner'
import { userMetadataAtom } from '../components/Layout'
import { useSetAtom } from 'jotai'

const Confirmation: Page = () => {
  const router = useRouter()
  const setUserMetadata = useSetAtom(userMetadataAtom)

  const { isError, error } = api.user.upsertUser.useQuery(undefined, {
    retry: true,
    onSuccess(data) {
      router.push('/')
      setUserMetadata(data)
    },
  })

  if (isError)
    return (
      <ErrorTemplate
        message={error.message}
        statusCode={error.data?.httpStatus}
      />
    )

  return <Spinner caption='Crunching user data...' />
}

Confirmation.title = 'Auth confirmation'

export default Confirmation
