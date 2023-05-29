import { mergeAttributes, Node } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('../Map'), {
  ssr: false,
})

const MapWrapper = (props: any) => (
  <NodeViewWrapper className='location w-3/4'>
    <Map position={[props.node.attrs.lat, props.node.attrs.long]} />
  </NodeViewWrapper>
)

export default Node.create({
  name: 'location',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      lat: {},
      long: {},
    }
  },

  parseHTML() {
    return [
      {
        tag: 'location',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['location', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(MapWrapper)
  },
})
