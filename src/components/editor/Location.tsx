import { Node, mergeAttributes } from '@tiptap/core'

type SetLocationOptions = {
  latitude: number
  longitude: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    location: {
      /**
       * Insert a location node
       */
      setLocation: (options: SetLocationOptions) => ReturnType
    }
  }
}

const Location = Node.create({
  name: 'location',
  inline: false,
  group: 'block',

  addAttributes() {
    return {
      latitude: {
        default: undefined,
        parseHTML: (element) => element.getAttribute('data-latitude'),
      },
      longitude: {
        default: undefined,
        parseHTML: (element) => element.getAttribute('data-longitude'),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-latitude][data-longitude]',
      },
    ]
  },

  addCommands() {
    return {
      setLocation:
        (options: SetLocationOptions) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },

  renderHTML({ HTMLAttributes }) {
    console.log('rendering')
    const { latitude, longitude } = HTMLAttributes
    // const text = `Location: ${latitude}, ${longitude}`
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-latitude': latitude,
        'data-longitude': longitude,
      }),
      0,
    ]
  },
})

export default Location
