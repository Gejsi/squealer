import CharacterCount from '@tiptap/extension-character-count'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './Toolbar'
import { useAtom } from 'jotai'
import { userMetadataAtom } from '../Layout'
import type { EditorOptions } from '@tiptap/core'
import Youtube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import Location from './Location'

const Editor = ({ onUpdate }: { onUpdate?: EditorOptions['onUpdate'] }) => {
  const [userMetadata] = useAtom(userMetadataAtom)

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: false,
          horizontalRule: false,
          gapcursor: false,
          dropcursor: false,
          code: {
            HTMLAttributes: {
              class: 'rounded-xl text-info bg-base-content/10 p-[0.5ch]',
            },
          },
        }),
        CharacterCount.configure({
          limit: userMetadata?.quota,
        }),
        Typography,
        Placeholder.configure({
          placeholder: 'Keep squealing...',
          showOnlyWhenEditable: false,
        }),
        Image,
        Link.configure({
          HTMLAttributes: {
            class: 'link',
          },
        }),
        Youtube,
        Location,
      ],
      editorProps: {
        attributes: {
          class:
            'prose outline-none max-h-96 min-h-[6rem] overflow-y-auto textarea textarea-bordered text-base',
          spellcheck: 'false',
        },
      },
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            text: 'Keep squealing...',
          },
        ],
      },
      onUpdate,
    },
    []
  )

  return (
    <>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </>
  )
}

export default Editor
