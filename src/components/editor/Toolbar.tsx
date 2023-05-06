import type { Editor } from '@tiptap/react'
import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'
import {
  MdAddPhotoAlternate,
  MdCode,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatStrikethrough,
} from 'react-icons/md'
import { BiCodeBlock } from 'react-icons/bi'
import { useCallback, useRef, useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { isImage } from '../../utils/misc'
import { toast } from 'react-hot-toast'

const VerticalDivider = () => (
  <div className='w-[0.125rem] bg-base-content/30' />
)

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const [showImageInput, setShowImageInput] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [autoAnimate] = useAutoAnimate()

  const addImage = useCallback(() => {
    const url = imageInputRef.current?.value

    if (!url || !isImage(url)) {
      toast.error('Provide a valid image url.')
      return
    }

    editor && editor.chain().focus().setImage({ src: url }).run()
    setShowImageInput(false)
  }, [editor])

  if (!editor) return null

  return (
    <div className='mb-2 flex flex-col gap-2'>
      <div className='flex flex-1 flex-nowrap overflow-y-auto'>
        <div className='btn-group flex-nowrap rounded-lg bg-base-content/10'>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={twMerge(
              'btn-icon',
              clsx({
                'btn-active': editor?.isActive('bold'),
              })
            )}
          >
            <MdFormatBold className='h-6 w-6' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={twMerge(
              'btn-icon',
              clsx({
                'btn-active': editor?.isActive('italic'),
              })
            )}
          >
            <MdFormatItalic className='h-6 w-6' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={twMerge(
              'btn-icon',
              clsx({
                'btn-active': editor?.isActive('strike'),
              })
            )}
          >
            <MdFormatStrikethrough className='h-6 w-6' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={twMerge(
              'btn-icon',
              clsx({
                'btn-active': editor?.isActive('code'),
              })
            )}
          >
            <MdCode className='h-6 w-6' />
          </button>

          <VerticalDivider />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={twMerge(
              'btn-icon',
              clsx({
                'btn-active': editor?.isActive('bulletList'),
              })
            )}
          >
            <MdFormatListBulleted className='h-6 w-6' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={twMerge(
              'btn-icon',
              clsx({
                'btn-active': editor?.isActive('orderedList'),
              })
            )}
          >
            <MdFormatListNumbered className='h-6 w-6' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={twMerge(
              'btn-icon',
              clsx({
                'btn-active': editor?.isActive('codeBlock'),
              })
            )}
          >
            <BiCodeBlock className='h-6 w-6' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={twMerge(
              'btn-icon',
              clsx({
                'btn-active': editor?.isActive('blockquote'),
              })
            )}
          >
            <MdFormatQuote className='h-6 w-6' />
          </button>

          <VerticalDivider />

          <button
            onClick={() => setShowImageInput((prev) => !prev)}
            className={twMerge(
              'btn-icon',
              clsx({
                'btn-active': editor?.isActive('image'),
              })
            )}
          >
            <MdAddPhotoAlternate className='h-6 w-6' />
          </button>
        </div>
      </div>

      <div className='form-control w-full' ref={autoAnimate}>
        {showImageInput && (
          <input
            ref={imageInputRef}
            type='text'
            placeholder='Image url'
            className='input-bordered input w-full'
            onChange={addImage}
            onBlur={() => setShowImageInput(false)}
          />
        )}
      </div>
    </div>
  )
}

export default Toolbar
