import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'achievements',
  title: 'Bridge Achievements',
  type: 'document',
  fields: [
    defineField({
      name: 'award',
      title: 'Award (formatting: Award, Location, Year)',
      type: 'string',
      validation: (Rule) => [Rule.required()],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => [Rule.required()],
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (Rule) => [Rule.required()],
    }),
  ],
  preview: {
    select: {
      title: 'award',
    },
  },
})
