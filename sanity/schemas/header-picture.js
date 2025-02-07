import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'headerImage',
  title: 'Page Header Image',
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
      name: 'path',
      title: 'Path to the page (e.g. "bridge" for .../bridge.html)',
      type: 'string',
      validation: (Rule) => [Rule.required()],
    }),
  ],
  preview: {
    select: {
      title: 'path',
      media: 'image',
    },
  },
})
