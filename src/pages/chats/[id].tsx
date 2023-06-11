import { useRouter } from 'next/router'
import { api } from '../../utils/api'
import type { Page } from '../_app'

const Chat: Page = () => {
  const receiverId = useRouter().query.id as string

  api.chat.getChat.useQuery(
    { receiverId },
    {
      onSuccess(data) {
        console.log(data)
      },
    }
  )

  return (
    <ul className='menu rounded-box bg-base-200'>
      <li>
        <a>Item 1</a>
      </li>
      <li>
        <a>Item 2</a>
      </li>
      <li>
        <a>Item 3</a>
      </li>
    </ul>
  )
}

Chat.title = 'Private chats'

export default Chat
