import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'join',
  title: 'Newsletter Link',
  type: 'document',
  fields: [
    defineField({
      name: 'link',
      title: 'Newsletter Link (MUST ONLY HAVE ONE ENTRY IN TABLE)',
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
