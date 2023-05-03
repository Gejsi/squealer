import type { Editor } from '@tiptap/react'
import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'
import {
  MdCode,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatStrikethrough,
} from 'react-icons/md'
import { BiCodeBlock } from 'react-icons/bi'

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null

  return (
    <div className='mb-4 flex flex-1 flex-nowrap overflow-y-auto'>
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
      </div>
    </div>
  )
}

export default Toolbar
