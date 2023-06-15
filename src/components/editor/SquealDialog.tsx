import { type ComponentProps, useState } from 'react'
import { Modal, ModalClose, ModalContent, ModalTitle } from '../Modal'
import Editor from './Editor'
import { atom, useAtom } from 'jotai'
import { userMetadataAtom } from '../Layout'
import { toast } from 'react-hot-toast'
import { cn } from '../../utils/misc'
import type { EditorOptions, JSONContent } from '@tiptap/core'

export const squealDialogAtom = atom<
  { username: string | undefined; id: string } | undefined
>(undefined)

export const editorLengthAtom = atom(0)

const SquealDialog = (
  props: ComponentProps<typeof Modal> & {
    onCreate: (content: JSONContent | undefined, channelId: string) => void
    isCreating: boolean
  }
) => {
  const [userMetadata] = useAtom(userMetadataAtom)
  const [editorLength, setEditorLength] = useAtom(editorLengthAtom)
  const [content, setContent] = useState<JSONContent | undefined>(undefined)
  const [receiverData, setReceiverData] = useAtom(squealDialogAtom)

  const handleCreate = (): void => {
    if (editorLength === 0) {
      toast.error('Cannot create an empty squeal.')
      return
    }

    if (receiverData?.id) props.onCreate(content, receiverData?.id)
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
          {receiverData?.username ? 'to ' : 'in this channel'}
          {receiverData?.username && (
            <span className='text-info'>@{receiverData.username}</span>
          )}
        </p>

        <Editor onUpdate={handleEditorUpdate} />
        <label className='label'>
          <span className='label-text-alt'>
            Quota remaining: {userMetadata && userMetadata.quota - editorLength}
          </span>
          <span className='label-text-alt'>
            {editorLength} / {userMetadata?.quota}
          </span>
        </label>

        <div className='modal-action'>
          <ModalClose>
            <button className='btn-ghost btn'>Cancel</button>
          </ModalClose>
          <button
            className={cn('btn-primary btn', { loading: props.isCreating })}
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
