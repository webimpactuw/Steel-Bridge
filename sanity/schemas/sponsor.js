import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'company',
  title: 'Company Sponsors',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Company Logo (Should be a rectangle)',
      type: 'image',
      validation: (Rule) => [Rule.required()],
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'index',
      title: 'Index',
      type: 'number',
      validation: (Rule) => [Rule.required()],
    }),
    defineField({
      name: 'name',
      title: 'Company Name',
      type: 'string',
      validation: (Rule) => [Rule.required()],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})
