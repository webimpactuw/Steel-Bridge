import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'join',
  title: 'Join Us Link',
  type: 'document',
  fields: [
    defineField({
      name: 'link',
      title: 'Form Link (MUST ONLY HAVE ONE ENTRY IN TABLE)',
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
