import { useRouter } from 'next/router'
import { api } from '../../utils/api'
import type { Page } from '../_app'
import Bubble from '../../components/Bubble'
import ErrorTemplate from '../../components/ErrorTemplate'
import Spinner from '../../components/Spinner'
import { MdEdit } from 'react-icons/md'
import { toast } from 'react-hot-toast'
import SquealDialog from '../../components/editor/SquealDialog'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import useSquealDialog from '../../hooks/use-squeal-dialog'

const Chat: Page = () => {
  const chatId = useRouter().query.id as string
  const [autoAnimate] = useAutoAnimate()

  const { data, isLoading, isError, error } = api.chat.getChat.useQuery(
    {
      channelId: chatId,
    },
    {
      retry: false,
    }
  )

  const { openDialog, closeDialog } = useSquealDialog()

  const context = api.useContext()
  const chatMutation = api.chat.newSqueal.useMutation({
    onError() {
      toast.error('Unable to send squeal.')
    },
    onSuccess() {
      toast.success('Squeal successfully sent.')
      closeDialog()
    },
    onSettled() {
      context.chat.getChat.invalidate()
    },
  })

  if (isError)
    return (
      <ErrorTemplate
        message={error.message}
        statusCode={error.data?.httpStatus}
      />
    )

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className='flex flex-col gap-4' ref={autoAnimate}>
          {data.map((squeal) => (
            <Bubble key={squeal.id} squeal={squeal} />
          ))}

          <button
            className='fab btn-primary btn h-fit w-fit gap-2 self-end py-2'
            onClick={() => openDialog({ id: chatId, type: 'chat' })}
          >
            <MdEdit className='h-4 w-4' />
            Write New Squeal
          </button>
        </div>
      )}

      <SquealDialog
        onCreate={(content, chatId) =>
          content && chatMutation.mutate({ content, channelId: chatId })
        }
        isCreating={chatMutation.isLoading}
      />
    </>
  )
}

Chat.title = 'Private chat'

export default Chat
