import { useEditor, EditorContent } from '@tiptap/react'
import type { EditorOptions } from '@tiptap/core'
import { ChannelMention, UserMention } from './Mention'
import { useRouter } from 'next/router'
import { commonEditorOptions } from './Editor'

const ReadonlyEditor = ({ content }: { content: EditorOptions['content'] }) => {
  const router = useRouter()

  const editor = useEditor(
    {
      extensions: [
        ...commonEditorOptions,
        UserMention.configure({
          HTMLAttributes: {
            class: 'link',
          },
        }),
        ChannelMention.configure({
          HTMLAttributes: {
            class: 'link text-red-400',
          },
        }),
      ],
      editorProps: {
        attributes: {
          class: 'prose outline-none max-h-96 overflow-y-auto text-base',
          spellcheck: 'false',
        },
        handleClickOn: (_, __, node) => {
          if (node.type.name === 'user-mention')
            router.push('/users/' + node.attrs.label)
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
