import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { RouterOutputs } from '../utils/api'
import Image from 'next/image'
import ReadonlyEditor from './editor/ReadonlyEditor'
import type { EditorOptions } from '@tiptap/core'
import Link from 'next/link'
import type { Url } from 'next/dist/shared/lib/router/router'
import {
  MdArrowOutward,
  MdRemoveRedEye,
  MdReply,
  MdThumbDown,
  MdThumbUp,
} from 'react-icons/md'
import { cn } from '../utils/misc'
import type { MouseEventHandler } from 'react'

dayjs.extend(relativeTime)

type BubbleProps = {
  squeal:
    | RouterOutputs['chat']['get'][0]
    | RouterOutputs['squeal']['getFromChannel']
  href?: Url
  isResponse?: boolean
  impressions?: number
  onLike?: MouseEventHandler<HTMLButtonElement>
  onDislike?: MouseEventHandler<HTMLButtonElement>
  onReply?: MouseEventHandler<HTMLButtonElement>
}

const Bubble = ({
  squeal,
  href,
  isResponse,
  impressions,
  onLike,
  onDislike,
  onReply,
}: BubbleProps) => (
  <div
    className={cn('chat rounded-box bg-base-200 p-4', {
      'chat-end': isResponse,
      'chat-start': !isResponse,
    })}
  >
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

    <div className='chat-footer flex w-full items-center justify-end gap-2'>
      {href && (
        <Link href={href} className='btn-ghost btn-sm btn gap-1'>
          <MdArrowOutward className='h-4 w-4' />
          Visit
        </Link>
      )}

      {impressions !== undefined && (
        <div className='tooltip' data-tip='Impressions'>
          <div className='flex items-center gap-2 px-2'>
            <MdRemoveRedEye className='h-4 w-4' />
            {impressions}
          </div>
        </div>
      )}

      {onLike && (
        <button className='btn-ghost btn-sm btn gap-1' onClick={onLike}>
          <MdThumbUp className='h-4 w-4' />0
        </button>
      )}

      {onDislike && (
        <button className='btn-ghost btn-sm btn gap-1' onClick={onDislike}>
          <MdThumbDown className='h-4 w-4' />0
        </button>
      )}

      {onReply && (
        <button className='btn-ghost btn-sm btn gap-1' onClick={onReply}>
          <MdReply className='h-4 w-4' />
          Reply
        </button>
      )}
    </div>
  </div>
)

export default Bubble
