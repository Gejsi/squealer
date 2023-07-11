import { type ComponentProps, useState } from 'react'
import { Modal, ModalClose, ModalContent, ModalTitle } from '../Modal'
import Editor from './Editor'
import { atom, useAtom } from 'jotai'
import { userMetadataAtom } from '../Layout'
import { toast } from 'react-hot-toast'
import { cn } from '../../utils/misc'
import type { EditorOptions, JSONContent } from '@tiptap/core'
import { squealDialogAtom } from '../../hooks/use-squeal-dialog'
import { api } from '../../utils/api'

export const editorLengthAtom = atom(0)

const SquealDialog = (
  props: ComponentProps<typeof Modal> & {
    onCreate: (content: JSONContent | undefined, channelId: string) => void
    isCreating: boolean
  }
) => {
  const [userMetadata, setUserMetadata] = useAtom(userMetadataAtom)
  const [editorLength, setEditorLength] = useAtom(editorLengthAtom)
  const [content, setContent] = useState<JSONContent | undefined>(undefined)
  const [receiverData, setReceiverData] = useAtom(squealDialogAtom)

  const { data: randomUsers } = api.user.getAllRandom.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  })

  const { data: randomChannels } = api.channel.getAllRandom.useQuery(
    undefined,
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  )

  const handleCreate = (): void => {
    if (editorLength === 0) {
      toast.error('Cannot create an empty squeal.')
      return
    }

    if (receiverData?.id) props.onCreate(content, receiverData?.id)
    setUserMetadata(
      (prev) => prev && { ...prev, quota: prev.quota + editorLength }
    )
    setEditorLength(0)
  }

  const handleEditorUpdate = ({
    editor,
  }: Parameters<EditorOptions['onUpdate']>[0]) => {
    setEditorLength(() => editor.storage.characterCount.characters())
    setContent(() => editor.getJSON())
  }

  return (
    <Modal
      open={!!receiverData}
      onOpenChange={(state) => {
        setReceiverData(state ? receiverData : undefined)
        setEditorLength(0)
      }}
      {...props}
    >
      <ModalContent>
        <ModalTitle>Write a new squeal</ModalTitle>
        <p className='mb-4 text-sm italic'>
          This squeal will be sent{' '}
          {receiverData?.username
            ? 'to '
            : receiverData?.type === 'chat'
            ? 'in this chat'
            : 'in this channel'}
          {receiverData?.username && (
            <span className='text-info'>@{receiverData.username}</span>
          )}
        </p>

        {randomUsers && randomChannels && (
          <Editor
            onUpdate={handleEditorUpdate}
            userSuggestions={randomUsers}
            channelSuggestions={randomChannels}
          />
        )}

        {receiverData?.type !== 'chat' && (
          <>
            <label className='label'>
              <span className='label-text-alt'>
                Daily quota remaining:{' '}
                {userMetadata &&
                  userMetadata.dailyQuotaLimit -
                    userMetadata.quota -
                    editorLength}
              </span>
              <span className='label-text-alt'>
                {editorLength} /{' '}
                {userMetadata &&
                  userMetadata.dailyQuotaLimit - userMetadata.quota}
              </span>
            </label>
            <label className='label pt-0'>
              <span className='label-text-alt'>
                Weekly quota remaining:{' '}
                {userMetadata &&
                  userMetadata.weeklyQuotaLimit -
                    userMetadata.quota -
                    editorLength}
              </span>
              <span className='label-text-alt'>
                {editorLength} /{' '}
                {userMetadata &&
                  userMetadata.weeklyQuotaLimit - userMetadata.quota}
              </span>
            </label>
            <label className='label pt-0'>
              <span className='label-text-alt'>
                Monthly quota remaining:{' '}
                {userMetadata &&
                  userMetadata.monthlyQuotaLimit -
                    userMetadata.quota -
                    editorLength}
              </span>
              <span className='label-text-alt'>
                {editorLength} /{' '}
                {userMetadata &&
                  userMetadata.monthlyQuotaLimit - userMetadata.quota}
              </span>
            </label>
          </>
        )}

        <div className='modal-action gap-2'>
          <button
            className={cn('btn-primary btn order-1', {
              loading: props.isCreating,
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
  )
}

export default SquealDialog
