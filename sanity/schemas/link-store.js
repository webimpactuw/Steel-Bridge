import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'store',
  title: 'Merch Store Link',
  type: 'document',
  fields: [
    defineField({
      name: 'link',
      title: 'Merch Store Link (MUST ONLY HAVE ONE ENTRY IN TABLE)',
      type: 'string',
      validation: (Rule) => [Rule.required()],
    }),
  ],
  preview: {
    select: {
      title: 'link',
    },
  },
})
