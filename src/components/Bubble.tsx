import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { RouterOutputs } from '../utils/api'

dayjs.extend(relativeTime)

// TODO: add remaining info
const Bubble = ({
  squeal,
}: {
  squeal: RouterOutputs['chat']['getChat'][0]
}) => (
  <div className='chat chat-start rounded-box bg-base-200 p-4'>
    <div className='chat-image avatar'>
      <div className='w-10 rounded-full'>
        <img src='https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg' />
      </div>
    </div>
    <div className='chat-header'>
      {squeal.authorId}
      <time className='pl-2 text-xs opacity-50'>
        {dayjs(squeal.createdAt).fromNow()}
      </time>
    </div>
    <div className='chat-bubble'>You were the Chosen One!</div>
  </div>
)

export default Bubble
