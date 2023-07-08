import Link from 'next/link'
import Image from 'next/image'
import { api } from '../../utils/api'
import type { Page } from '../_app'
import { RiChatPrivateFill } from 'react-icons/ri'
import Spinner from '../../components/Spinner'
import ErrorTemplate from '../../components/ErrorTemplate'

const AllChats: Page = () => {
  const { data, isLoading, isError, error } = api.chat.getAllChats.useQuery()

  if (isError)
    return (
      <ErrorTemplate
        message={error.message}
        statusCode={error.data?.httpStatus}
      />
    )

  return (
    <>
      <div className='mb-10 mt-8 flex items-center gap-4'>
        <RiChatPrivateFill className='h-8 w-8 flex-shrink-0' />
        <span>All your private conversations.</span>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <ul className='menu rounded-box bg-base-200'>
          {data.map((chat) => (
            <li key={chat.id}>
              <Link href={'/chats/' + chat.id}>
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
