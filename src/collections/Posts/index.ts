import { NotationBlock } from '@/blocks/Notation'
import { v4 as uuid } from 'uuid'
import {
  convertLexicalToMarkdown,
  editorConfigFactory,
  lexicalEditor,
  BlocksFeature,
} from '@payloadcms/richtext-lexical'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { CollectionConfig, RichTextField } from 'payload'
const PRODUCTS = process.env.PRODUCTS?.split(',') || []
export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      unique: true,
      defaultValue: () => uuid(),
      admin: {
        hidden: true,
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      localized: true,
    },
    {
      name: 'product',
      type: 'select',
      required: true,
      options: PRODUCTS,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            inlineBlocks: [NotationBlock],
          }),
        ],
      }),
    },
    {
      name: 'content-md',
      type: 'textarea',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeValidate: [
          ({ siblingData }) => {
            delete siblingData['content-md']
            // Ensure that the markdown field is not saved in the database
            return null
          },
        ],
        afterRead: [
          ({ siblingData, siblingFields }) => {
            const data: SerializedEditorState = siblingData['content']

            if (!data) {
              return ''
            }

            const markdown = convertLexicalToMarkdown({
              data,
              editorConfig: editorConfigFactory.fromField({
                field: siblingFields.find(
                  (field) => 'name' in field && field.name === 'content',
                ) as RichTextField,
              }),
            })

            return markdown
          },
        ],
      },
    },
  ],
}
