import CharacterCount from '@tiptap/extension-character-count'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './Toolbar'

const Editor = () => {
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
              class:
                'rounded-xl text-info bg-base-content/10 px-[0.5ch] py-[0.5ch]',
            },
          },
        }),
        CharacterCount.configure({
          limit: 500,
        }),
        Typography,
        Placeholder.configure({
          placeholder: 'Write something quirky...',
          showOnlyWhenEditable: false,
        }),
      ],
      editorProps: {
        attributes: {
          class:
            'prose outline-none max-h-60 overflow-y-auto textarea textarea-bordered text-base',
          spellcheck: 'false',
        },
      },
      content: `
    <h2>
        Hi there,
      </h2>
      <p>
        this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
      </p>
      <ul>
        <li>
          That’s a bullet list with one …
        </li>
        <li>
          … or two list items.
        </li>
      </ul>
      <p>
        Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
      </p>
      <pre><code class="language-css">body {
      display: none;
      }</code></pre>
      <p>
        I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
      </p>
      <blockquote>
        Wow, that’s amazing. Good work, boy! 👏
        <br />
        — Mom
      </blockquote>
`,
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
