import Link from 'next/link'
import Image from 'next/image'
import { api } from '../../utils/api'
import type { Page } from '../_app'
import { RiChatPrivateFill } from 'react-icons/ri'
import Spinner from '../../components/Spinner'
import ErrorTemplate from '../../components/ErrorTemplate'

const AllChats: Page = () => {
  const { data, isLoading, isError, error } =
    api.chat.getAllChats.useQuery(undefined)

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

      {isError ? (
        <ErrorTemplate
          message='Error while fetching private chats'
          statusCode={error.data?.httpStatus}
        />
      ) : isLoading ? (
        <Spinner />
      ) : (
        <ul className='menu rounded-box bg-base-200'>
          {data.map((chat) => (
            <li key={chat.id}>
              <Link href={'chats/' + chat.id}>
                <div className='avatar-group -space-x-6'>
                  {chat.members.map((member) => (
                    <div className='avatar' key={member.id}>
                      <div className='w-12'>
                        <Image
                          src={member.profileImageUrl}
                          alt='User profile picture'
                          fill
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <p>{chat.name}</p>
                  <p className='text-xs italic'>
                    Number of squeals: {chat._count.squeals}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

AllChats.title = 'Private chats'

export default AllChats
