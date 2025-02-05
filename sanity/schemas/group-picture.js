import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'groupImage',
  title: 'Team Page Group Picture',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      validation: (Rule) => [Rule.required()],
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'year',
      title: 'Team Year, latest year will be displayed first, must be one year (2023 -> 2023-2024)',
      type: 'number',
      initialValue: 2023,
      validation: (Rule) => [Rule.required()],
    }),
  ],
  preview: {
    select: {
      title: 'year',
      media: 'image',
    },
  },
})
