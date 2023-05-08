import type { ComponentProps } from 'react'
import { Modal, ModalClose, ModalContent, ModalTitle } from '../Modal'
import Editor from './Editor'
import { useAtom } from 'jotai'
import { publicMetadataAtom } from '../Layout'

const SquealDialog = (props: ComponentProps<typeof Modal>) => {
  const [publicMetadata] = useAtom(publicMetadataAtom)

  return (
    <Modal {...props}>
      <ModalContent>
        <ModalTitle>Write a new squeal</ModalTitle>

        <div className='flex flex-col'>
          <div className='form-control w-full'>
            <label className='label' htmlFor='receivers'>
              <span className='label-text'>Send to:</span>
            </label>
            <input
              type='text'
              id='receivers'
              placeholder='§ALL, @friend, §channel...'
              className='input-bordered input'
            />
            <label className='label hidden'>
              <span className='label-text-alt text-error'>Error text</span>
            </label>
          </div>

          <div className='divider' />

          <div className='form-control'>
            <Editor />
            <label className='label justify-end'>
              <span className='label-text-alt'>/ {publicMetadata.quota}</span>
            </label>
          </div>
        </div>

        <div className='modal-action'>
          <ModalClose>
            <button className='btn-ghost btn'>Cancel</button>
          </ModalClose>
          <ModalClose>
            <button
              className='btn-primary btn'
              onClick={() => console.log('created')}
            >
              Create
            </button>
          </ModalClose>
        </div>
      </ModalContent>
    </Modal>
  )
}

export default SquealDialog
