import { UsersIcon } from '@sanity/icons'

export default {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: UsersIcon,
  // Limit to a single instance (same pattern as landingPageSchema)
  __experimental_actions: [/*'create',*/ 'update', /*'delete',*/ 'publish'],
  fields: [
    {
      name: 'pageTitle',
      title: 'Page Title (Browser Tab)',
      type: 'string',
      initialValue: 'About Us',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'metaDescription',
      title: 'Meta Description (for SEO)',
      type: 'text',
      rows: 3,
      initialValue:
        'Meet the team behind Ashton & Carrington — IFA-accredited accountancy and tax advisory.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      description: 'Displayed as the main heading, e.g. "MEET THE TEAM"',
      initialValue: 'MEET THE TEAM',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'intro',
      title: 'Intro Paragraph',
      type: 'text',
      rows: 3,
      description: 'Short paragraph shown under the heading (optional)',
    },
    {
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'teamMember',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'role',
              title: 'Role / Job Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'bio',
              title: 'Blurb',
              type: 'text',
              rows: 3,
              description: 'Two to three lines about this person.',
              validation: (Rule) => Rule.max(280),
            },
            {
              name: 'photo',
              title: 'Photo',
              type: 'image',
              description:
                'Square or portrait headshot. It is cropped to a circle — use the hotspot to centre the face.',
              options: { hotspot: true },
            },
            {
              name: 'linkedinUrl',
              title: 'LinkedIn URL',
              type: 'url',
              description: 'Full URL, e.g. https://www.linkedin.com/in/jane-ashton/',
            },
          ],
          preview: {
            select: { title: 'name', subtitle: 'role', media: 'photo' },
          },
        },
      ],
    },
  ],
  preview: {
    select: { title: 'pageTitle' },
    prepare({ title }) {
      return { title: title || 'About Page' }
    },
  },
}
