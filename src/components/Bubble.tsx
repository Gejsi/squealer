import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { RouterOutputs } from '../utils/api'
import Image from 'next/image'
import ReadonlyEditor from './editor/ReadonlyEditor'
import type { EditorOptions } from '@tiptap/core'
import Link from 'next/link'
import type { Url } from 'next/dist/shared/lib/router/router'
import { MdArrowOutward } from 'react-icons/md'

dayjs.extend(relativeTime)

const Bubble = ({
  squeal,
  href,
}: {
  squeal: RouterOutputs['chat']['get'][0]
  href?: Url
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

    <div className='chat-bubble break-all bg-base-100'>
      <ReadonlyEditor content={squeal.content as EditorOptions['content']} />
    </div>

    {href && (
      <div className='chat-footer flex gap-2' style={{ gridColumnStart: 3 }}>
        <Link href={href} className='btn-ghost btn-sm btn gap-1'>
          <MdArrowOutward className='h-4 w-4' />
          Visit
        </Link>
      </div>
    )}
  </div>
)

export default Bubble
