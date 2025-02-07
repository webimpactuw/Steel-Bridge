import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'individual',
  title: 'Individual Sponsors',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => [Rule.required()],
    }),
    defineField({
      name: 'index',
      title: 'Index',
      type: 'number',
      validation: (Rule) => [Rule.required()],
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})
