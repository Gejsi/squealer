import { useRouter } from 'next/router'
import { api } from '../../utils/api'
import type { Page } from '../_app'
import Bubble from '../../components/Bubble'
import ErrorTemplate from '../../components/ErrorTemplate'
import Spinner from '../../components/Spinner'

const Chat: Page = () => {
  const chatId = useRouter().query.id as string

  const { data, isLoading, isError, error } = api.chat.getChat.useQuery({
    chatId,
  })

  if (isError)
    return (
      <ErrorTemplate
        message='Error while fetching chat'
        statusCode={error.data?.httpStatus}
      />
    )

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className='flex flex-col gap-4 odd:bg-primary'>
          {data.map((squeal) => (
            <Bubble key={squeal.id} squeal={squeal} />
          ))}
        </div>
      )}
    </>
  )
}

Chat.title = 'Private chat'

export default Chat
