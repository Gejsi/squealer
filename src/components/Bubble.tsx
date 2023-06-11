import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { RouterOutputs } from '../utils/api'
import Image from 'next/image'
import ReadonlyEditor from './editor/ReadonlyEditor'
import type { EditorOptions } from '@tiptap/core'

dayjs.extend(relativeTime)

const Bubble = ({
  squeal,
}: {
  squeal: RouterOutputs['chat']['getChat'][0]
}) => (
  <div className='chat chat-start rounded-box bg-base-200 p-4'>
    <div className='chat-image avatar'>
      <div className='w-12'>
        <Image
          src={squeal.author.profileImageUrl}
          alt='User profile picture'
          fill
          className='rounded-full'
        />
      </div>
    </div>

    <div className='chat-header mb-1 font-bold'>
      @{squeal.author.username}
      <time className='pl-2 text-xs opacity-50'>
        {dayjs(squeal.createdAt).fromNow()}
      </time>
    </div>

    <div className='chat-bubble bg-base-100'>
      <ReadonlyEditor content={squeal.content as EditorOptions['content']} />
    </div>
  </div>
)

export default Bubble
