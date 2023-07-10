import CharacterCount from '@tiptap/extension-character-count'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './Toolbar'
import { useAtomValue } from 'jotai'
import { userMetadataAtom } from '../Layout'
import type { EditorOptions } from '@tiptap/core'
import Youtube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import Location from './Location'
import { squealDialogAtom } from '../../hooks/use-squeal-dialog'
import { createSuggestionList } from './Suggestion'
import { ChannelMention, UserMention } from './Mention'
import { useRouter } from 'next/router'
import type { RouterOutputs } from '../../utils/api'

export const commonEditorOptions = [
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
  Link.configure({
    HTMLAttributes: {
      class: 'link',
    },
  }),
  Typography,
  Image,
  Youtube,
  Location,
]

const Editor = ({
  onUpdate,
  userSuggestions,
}: {
  onUpdate?: EditorOptions['onUpdate']
  userSuggestions: RouterOutputs['user']['getAllRandom']
}) => {
  const userMetadata = useAtomValue(userMetadataAtom)
  const receiverData = useAtomValue(squealDialogAtom)
  const router = useRouter()

  const editor = useEditor(
    {
      extensions: [
        ...commonEditorOptions,
        CharacterCount.configure({
          limit:
            receiverData?.type === 'chat'
              ? undefined
              : userMetadata?.dailyQuotaLimit === 0 ||
                userMetadata?.weeklyQuotaLimit === 0 ||
                userMetadata?.monthlyQuotaLimit === 0
              ? -1
              : Math.min(
                  (userMetadata &&
                    userMetadata.dailyQuotaLimit - userMetadata.quota) ??
                    -1,
                  (userMetadata &&
                    userMetadata.weeklyQuotaLimit - userMetadata.quota) ??
                    -1,
                  (userMetadata &&
                    userMetadata.monthlyQuotaLimit - userMetadata.quota) ??
                    -1
                ),
        }),
        Placeholder.configure({
          placeholder: 'Keep squealing...',
          showOnlyWhenEditable: false,
        }),
        UserMention.configure({
          HTMLAttributes: {
            class: 'link',
          },
          suggestion: createSuggestionList(userSuggestions),
        }),
        ChannelMention.configure({
          HTMLAttributes: {
            class: 'link text-red-400',
          },
        }),
      ],
      editorProps: {
        attributes: {
          class:
            'prose outline-none max-h-96 min-h-[6rem] overflow-y-auto textarea textarea-bordered text-base',
          spellcheck: 'false',
        },
        handleClickOn: (_, __, node) => {
          if (node.type.name === 'user-mention')
            router.push('/users/' + node.attrs.label)
        },
      },
      autofocus: true,
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
