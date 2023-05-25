import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'member',
  title: 'Members',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Member Name',
      type: 'string',
      validation: Rule => [
        Rule.required(),
      ],
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    defineField({
      name: 'linkedin',
      title: 'Linkedin Link (https://www.linkedin.com/in/USERNAME/)',
      type: 'string',
    }),
    defineField({
      name: 'officer',
      title: 'Officer?',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'year',
      title: 'Team Year, latest year will be displayed first, must be one year (2023 -> 2023-2024)',
      type: 'number',
      initialValue: 2023,
      validation: Rule => [
        Rule.required(),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})
