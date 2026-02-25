import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navbarLinks',
      type: 'array',
      label: 'Navbar Links',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'visible',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'loggedInOnly',
          type: 'checkbox',
          label: 'Visible only for logged in users',
          defaultValue: false,
        },
      ],
    },
  ],
}
