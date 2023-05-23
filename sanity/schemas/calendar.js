import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'calendar',
  title: 'Calendar Link',
  type: 'document',
  fields: [
    defineField({
      name: 'link',
      title: 'iCalendar Link (MUST ONLY HAVE ONE ENTRY) Format: Website link that ends with .ics',
      type: 'string',
      validation: Rule => [
        Rule.required(),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'link',
    },
  },
})
