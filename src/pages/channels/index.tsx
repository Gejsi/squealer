import Link from 'next/link'
import Image from 'next/image'
import { api } from '../../utils/api'
import type { Page } from '../_app'
import Spinner from '../../components/Spinner'
import ErrorTemplate from '../../components/ErrorTemplate'
import { MdGroup, MdGroupAdd } from 'react-icons/md'
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalTitle,
} from '../../components/Modal'
import { useState } from 'react'
import { cn } from '../../utils/misc'
import { toast } from 'react-hot-toast'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useAtomValue } from 'jotai'
import { userMetadataAtom } from '../../components/Layout'

const ChannelsPage: Page = () => {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [text, setText] = useState('')
  const [autoAnimate] = useAutoAnimate()
  const context = api.useContext()
  const userMetadata = useAtomValue(userMetadataAtom)

  const { data, isLoading, isError, error } =
    api.channel.getSubscribedChannels.useQuery()

  const { mutate: createChannel, isLoading: isCreating } =
    api.channel.create.useMutation({
      onError() {
        toast.error('Unable to create channel.')
      },
      onSuccess(data) {
        toast.success(`'${data.name}' has been created.`)
        setDialogOpen(() => false)
      },
      onSettled() {
        context.channel.getSubscribedChannels.invalidate()
      },
    })

  const handleCreate = (): void => {
    if (text.length === 0) {
      toast.error('A channel name must be provided.')
      return
    }

    createChannel({ name: text })
  }

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
        <MdGroup className='h-8 w-8 flex-shrink-0' />
        <span>
          Here are all the channels you are subscribed to.
          <br /> Premium users can even create new ones.
        </span>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <ul className='menu rounded-box bg-base-200' ref={autoAnimate}>
            {data.map((channel) => (
              <li key={channel.id}>
                <Link href={'/channels/' + channel.id}>
                  <div className='avatar-group -space-x-6'>
                    <div className='avatar' key={channel.id}>
                      <div className='w-12'>
                        <Image
                          src={channel.owner.profileImageUrl}
                          alt='Owner profile picture'
                          fill
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p>{channel.name}</p>
                    <p className='text-xs italic'>
                      Owner: {channel.owner.username}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <button
            className='fab btn-primary btn mt-4 h-fit w-fit gap-2 self-end py-2'
            disabled={userMetadata?.role === 'Regular'}
            onClick={() => setDialogOpen(() => true)}
          >
            <MdGroupAdd className='h-4 w-4' />
            Create channel
          </button>
        </>
      )}

      <Modal open={isDialogOpen} onOpenChange={(state) => setDialogOpen(state)}>
        <ModalContent>
          <ModalTitle>Create a new channel</ModalTitle>

          <input
            type='text'
            placeholder='Write a cool name...'
            className='input-bordered input w-full'
            minLength={1}
            maxLength={100}
            onChange={(e) => setText(() => e.target.value)}
          />

          <div className='modal-action gap-2'>
            <button
              className={cn('btn-primary btn order-1', {
                loading: isCreating,
              })}
              onClick={handleCreate}
            >
              Create
            </button>

            <ModalClose>
              <button className='btn-ghost btn'>Cancel</button>
            </ModalClose>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}

ChannelsPage.title = 'Your channels'

export default ChannelsPage
