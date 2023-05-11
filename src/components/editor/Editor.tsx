import CharacterCount from '@tiptap/extension-character-count'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './Toolbar'
import Location from './Location'
import { useAtom } from 'jotai'
import { publicMetadataAtom } from '../Layout'
import type { EditorOptions } from '@tiptap/core'
import Youtube from '@tiptap/extension-youtube'

const Editor = ({ onUpdate }: { onUpdate?: EditorOptions['onUpdate'] }) => {
  const [publicMetadata] = useAtom(publicMetadataAtom)

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
          limit: publicMetadata.quota,
        }),
        Typography,
        Placeholder.configure({
          placeholder: 'Write something quirky...',
          showOnlyWhenEditable: false,
        }),
        Image,
        Youtube,
        Location,
      ],
      editorProps: {
        attributes: {
          class:
            'prose outline-none max-h-72 overflow-y-auto textarea textarea-bordered text-base',
          spellcheck: 'false',
        },
      },
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            text: 'Write something quirky...',
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
