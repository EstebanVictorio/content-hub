import { Block } from 'payload'
import { RoughNotationProps, types, RoughNotation } from 'react-rough-notation'
type NotationType = RoughNotationProps['type']
type Props = {
  text: string
  className?: string
}

const TYPE_OPTIONS = [
  { type: 'underline', label: 'Underline' },
  { type: 'box', label: 'Box' },
  { type: 'circle', label: 'Circle' },
  { type: 'highlight', label: 'Highlight' },
  { type: 'strike-through', label: 'Strike Through' },
  { type: 'crossed-off', label: 'Crossed Off' },
  { type: 'bracket', label: 'Bracket' },
] as const

export const NotationBlock: Block = {
  slug: 'Notation',
  fields: [
    {
      name: 'type',
      type: 'select',
      options: TYPE_OPTIONS.map((type) => ({ label: type.label, value: type.type })),
      required: true,
    },
    {
      name: 'text',
      type: 'text',
      required: true,
    },
    {
      name: 'view',
      type: 'ui',
      label: 'View',
      admin: {
        custom: {
          name: 'text',
        },
        components: {
          Label: '@/components/Notation#Label',
          Field: '@/components/Notation#Notation',
        },
      },
    },
  ],
  jsx: {
    import: ({ children, markdownToLexical }) => {
      return {
        content: markdownToLexical({ markdown: children }),
      }
    },
    export: ({ fields }) => {
      const props: Record<string, unknown> = {}
      if (fields.type) props.type = fields.type

      const md = fields.text
      return {
        children: md,
        props,
      }
    },
  },
}
