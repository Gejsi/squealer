import type { Page } from './_app'
import ErrorTemplate from '../components/ErrorTemplate'

const Custom404: Page = () => {
  return <ErrorTemplate message='Page not found.' statusCode={404} />
}

Custom404.title = 'Oops'

export default Custom404
