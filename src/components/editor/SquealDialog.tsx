import { type ComponentProps, useState } from 'react'
import { Modal, ModalClose, ModalContent, ModalTitle } from '../Modal'
import Editor from './Editor'
import { atom, useAtom } from 'jotai'
import { userMetadataAtom } from '../Layout'
import { toast } from 'react-hot-toast'
import { api } from '../../utils/api'
import { cn } from '../../utils/misc'
import type { EditorOptions, JSONContent } from '@tiptap/core'

export const squealDialogAtom = atom<
  { username: string; id: string } | undefined
>(undefined)

const SquealDialog = (props: ComponentProps<typeof Modal>) => {
  const [userMetadata] = useAtom(userMetadataAtom)
  const [editorLength, setEditorLength] = useState(0)
  const [content, setContent] = useState<JSONContent | undefined>(undefined)
  const [receiverData, setReceiverData] = useAtom(squealDialogAtom)

  const { mutate: createSqueal, isLoading: isCreating } =
    api.chat.create.useMutation({
      onError() {
        toast.error('Unable to create squeal.')
      },
      onSuccess() {
        toast.success('Squeal has been created.')
        setReceiverData(undefined)
        setEditorLength(0)
      },
    })

  const handleCreate = (): void => {
    if (editorLength === 0) {
      toast.error('Cannot create an empty squeal.', { position: 'top-right' })
      return
    }

    if (content && receiverData)
      createSqueal({ content, receiverId: receiverData.id })
  }

  const handleEditorUpdate = ({
    editor,
  }: Parameters<EditorOptions['onUpdate']>[0]) => {
    setEditorLength(() => editor.storage.characterCount.characters())
    setContent(() => editor.getJSON())
  }

  return (
    <Modal
      {...props}
      open={!!receiverData}
      onOpenChange={(state) => {
        setReceiverData(state ? receiverData : undefined)
        setEditorLength(0)
      }}
    >
      <ModalContent>
        <ModalTitle>Write a new squeal</ModalTitle>
        <p className='mb-4 text-sm italic'>
          This squeal will be received by{' '}
          <span className='text-info'>@{receiverData?.username}</span>
        </p>

        <Editor onUpdate={handleEditorUpdate} />
        <label className='label'>
          <span className='label-text-alt'>
            Quota remaining: {userMetadata.quota - editorLength}
          </span>
          <span className='label-text-alt'>
            {editorLength} / {userMetadata.quota}
          </span>
        </label>

        <div className='modal-action'>
          <ModalClose>
            <button className='btn-ghost btn'>Cancel</button>
          </ModalClose>
          <button
            className={cn('btn-primary btn', { loading: isCreating })}
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      </ModalContent>
    </Modal>
  )
}

export default SquealDialog
