import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import type { EditorOptions } from '@tiptap/core'
import Youtube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import Location from './Location'

const ReadonlyEditor = ({ content }: { content: EditorOptions['content'] }) => {
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
        Typography,
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
          class: 'prose outline-none max-h-96 overflow-y-auto text-base',
          spellcheck: 'false',
        },
      },
      editable: false,
      content,
    },
    []
  )

  return <EditorContent editor={editor} />
}

export default ReadonlyEditor
