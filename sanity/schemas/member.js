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
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})
