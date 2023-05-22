import { type ComponentProps, useState } from 'react'
import { Modal, ModalClose, ModalContent, ModalTitle } from '../Modal'
import Editor from './Editor'
import { useAtom } from 'jotai'
import { userMetadataAtom } from '../Layout'
import { toast } from 'react-hot-toast'
import { squealDialogAtom } from '../Sidebar'

const SquealDialog = (props: ComponentProps<typeof Modal>) => {
  const [userMetadata] = useAtom(userMetadataAtom)
  const [editorLength, setEditorLength] = useState(0)
  const [, setDialogOpen] = useAtom(squealDialogAtom)

  const handleCreate = (): void => {
    if (editorLength === 0) {
      toast.error('Cannot create an empty squeal.', { position: 'top-right' })
      return
    }

    setDialogOpen(false)
  }

  return (
    <Modal {...props}>
      <ModalContent>
        <ModalTitle>Write a new squeal</ModalTitle>

        <div className='flex flex-col'>
          <div className='form-control'>
            <Editor
              onUpdate={({ editor }) =>
                setEditorLength(() =>
                  editor.storage.characterCount.characters()
                )
              }
            />
            <label className='label'>
              <span className='label-text-alt'>
                Ruota remaining: {userMetadata.quota - editorLength}
              </span>
              <span className='label-text-alt'>
                {editorLength} / {userMetadata.quota}
              </span>
            </label>
          </div>
        </div>

        <div className='modal-action'>
          <ModalClose>
            <button className='btn-ghost btn'>Cancel</button>
          </ModalClose>
          <button className='btn-primary btn' onClick={handleCreate}>
            Create
          </button>
        </div>
      </ModalContent>
    </Modal>
  )
}

export default SquealDialog
