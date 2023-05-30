import type { Editor } from '@tiptap/react'
import {
  MdAddPhotoAlternate,
  MdClose,
  MdCode,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatStrikethrough,
  MdLink,
  MdMap,
} from 'react-icons/md'
import { BsYoutube } from 'react-icons/bs'
import { BiCodeBlock } from 'react-icons/bi'
import { useCallback, useRef, useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { cn, isImage, isLink, isYoutubeUrl } from '../../utils/misc'
import { toast } from 'react-hot-toast'
import useDebouncedCallback from '../../hooks/use-debounced-callback'

const VerticalDivider = () => (
  <div className='w-[0.125rem] bg-base-content/30' />
)

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const [showInput, setShowInput] = useState<
    'image' | 'youtube' | 'link' | undefined
  >(undefined)
  const inputRef = useRef<HTMLInputElement>(null)
  const [autoAnimate] = useAutoAnimate()

  const addImage = useDebouncedCallback(() => {
    const url = inputRef.current?.value

    if (!url || !isImage(url)) {
      toast.error('Provide a valid image:\ncheck the URL extension.', {
        position: 'top-right',
      })
      return
    }

    editor && editor.chain().focus().setImage({ src: url }).run()
    setShowInput(undefined)
  }, 500)

  const addYoutubeVideo = useDebouncedCallback(() => {
    const url = inputRef.current?.value

    if (!url || !isYoutubeUrl(url)) {
      toast.error('Provide a valid youtube URL.', {
        position: 'top-right',
      })
      return
    }

    editor && editor.chain().focus().setYoutubeVideo({ src: url }).run()
    setShowInput(undefined)
  }, 500)

  const addLink = useDebouncedCallback(() => {
    const url = inputRef.current?.value

    if (!url || !isLink(url)) {
      toast.error('Provide a valid link.', {
        position: 'top-right',
      })
      return
    }

    editor && editor.chain().focus().setLink({ href: url }).run()
    setShowInput(undefined)
  }, 500)

  const addLocation = useCallback(() => {
    toast.loading('Getting your current location.', {
      id: 'location',
    })

    if ('geolocation' in navigator) {
      // geolocation is available
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          toast.success('Your location has been found.', { id: 'location' })

          editor
            ?.chain()
            .focus()
            .insertContent(
              `<location lat="${latitude}" long="${longitude}"></location>`
            )
            .run()
        },
        () => {
          toast.error('Something went wrong while getting current location.', {
            id: 'location',
          })
        }
      )
    } else {
      toast.error('Geolocation is not available.', {
        id: 'location',
      })
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className='mb-4 flex flex-col gap-2'>
      <div className='flex flex-1 flex-nowrap overflow-y-auto'>
        <div className='btn-group flex-nowrap rounded-lg bg-base-content/10'>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={cn('btn-icon', {
              'btn-active': editor?.isActive('bold'),
            })}
          >
            <MdFormatBold className='h-6 w-6' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={cn('btn-icon', {
              'btn-active': editor?.isActive('italic'),
            })}
          >
            <MdFormatItalic className='h-6 w-6' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={cn('btn-icon', {
              'btn-active': editor?.isActive('strike'),
            })}
          >
            <MdFormatStrikethrough className='h-6 w-6' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={cn('btn-icon', {
              'btn-active': editor?.isActive('code'),
            })}
          >
            <MdCode className='h-6 w-6' />
          </button>

          <VerticalDivider />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn('btn-icon', {
              'btn-active': editor?.isActive('bulletList'),
            })}
          >
            <MdFormatListBulleted className='h-6 w-6' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn('btn-icon', {
              'btn-active': editor?.isActive('orderedList'),
            })}
          >
            <MdFormatListNumbered className='h-6 w-6' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={cn('btn-icon', {
              'btn-active': editor?.isActive('codeBlock'),
            })}
          >
            <BiCodeBlock className='h-6 w-6' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn('btn-icon', {
              'btn-active': editor?.isActive('blockquote'),
            })}
          >
            <MdFormatQuote className='h-6 w-6' />
          </button>

          <VerticalDivider />

          <button
            onClick={() => setShowInput('image')}
            className={cn('btn-icon', {
              'btn-active': editor?.isActive('image'),
            })}
          >
            <MdAddPhotoAlternate className='h-6 w-6' />
          </button>

          <button
            onClick={() => setShowInput('youtube')}
            className={cn('btn-icon', {
              'btn-active': editor?.isActive('youtube'),
            })}
          >
            <BsYoutube className='h-5 w-5' />
          </button>

          <button
            onClick={addLocation}
            className={cn('btn-icon', {
              'btn-active': editor?.isActive('location'),
            })}
          >
            <MdMap className='h-6 w-6' />
          </button>

          <button
            onClick={() => setShowInput('link')}
            className={cn('btn-icon', {
              'btn-active': editor?.isActive('link'),
            })}
          >
            <MdLink className='h-6 w-6' />
          </button>
        </div>
      </div>

      <div className='form-control w-full' ref={autoAnimate}>
        {showInput && (
          <div className='form-control'>
            <div className='input-group'>
              <input
                ref={inputRef}
                type='text'
                placeholder={
                  showInput === 'image'
                    ? 'Image url ending in png, jpg...'
                    : showInput === 'youtube'
                    ? 'Youtube url video...'
                    : 'https://www.wikipedia.org/'
                }
                className='input-bordered input w-full'
                onChange={
                  showInput === 'image'
                    ? addImage
                    : showInput === 'youtube'
                    ? addYoutubeVideo
                    : addLink
                }
                autoFocus
              />
              <button
                className='btn-square btn'
                onClick={() => setShowInput(undefined)}
              >
                <MdClose className='h-6 w-6' />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Toolbar
