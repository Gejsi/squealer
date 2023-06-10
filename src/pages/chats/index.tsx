import Link from 'next/link'
import { api } from '../../utils/api'
import type { Page } from '../_app'
import { RiChatPrivateFill } from 'react-icons/ri'

const AllChats: Page = () => {
  const { data } = api.squeal.getPersonalChats.useQuery(undefined, {
    onSuccess(data) {
      console.log(data)
    },
  })

  return (
    <>
      <div className='alert mb-4 shadow-lg'>
        <div>
          <RiChatPrivateFill className='h-8 w-8 flex-shrink-0' />
          <span>
            Here are all your private squeals. You can even message yourself.
          </span>
        </div>
      </div>

      {(!data || !data.length) && <p>todo: empty</p>}

      <ul className='menu rounded-box bg-base-200'>
        <li>
          <a>Item 2</a>
        </li>
        <li>
          <a>Item 3</a>
        </li>
      </ul>
    </>
  )
}

AllChats.title = 'Private chats'

export default AllChats
