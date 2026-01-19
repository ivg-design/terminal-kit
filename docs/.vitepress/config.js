import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Terminal Kit',
  description: 'Terminal UI Web Components Documentation',
  base: '/public/docs/',

  // Use clean URLs
  cleanUrls: true,

  // Theme configuration
  themeConfig: {
    logo: false,

    nav: [
      { text: 'Demos', link: 'http://localhost:12359/' },
      { text: 'Icons', link: 'http://localhost:12359/demos/icons.html' },
      { text: 'GitHub', link: 'https://github.com/ivg-design/terminal-kit' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'API Reference', link: '/API' },
          { text: 'Component Schema', link: '/COMPONENT_SCHEMA' }
        ]
      },
      {
        text: 'Form Components',
        items: [
          { text: 'TButtonLit', link: '/components/TButtonLit' },
          { text: 'TInputLit', link: '/components/TInputLit' },
          { text: 'TTextareaLit', link: '/components/TTextareaLit' },
          { text: 'TToggleLit', link: '/components/TToggleLit' },
          { text: 'TSliderLit', link: '/components/TSliderLit' },
          { text: 'TDropdownLit', link: '/components/TDropdownLit' },
          { text: 'TColorPickerLit', link: '/components/TColorPickerLit' }
        ]
      },
      {
        text: 'Layout Components',
        items: [
          { text: 'TPanelLit', link: '/components/TPanelLit' },
          { text: 'TModalLit', link: '/components/TModalLit' },
          { text: 'TChatPanelLit', link: '/components/TChatPanelLit' }
        ]
      },
      {
        text: 'Display Components',
        items: [
          { text: 'TLoaderLit', link: '/components/TLoaderLit' },
          { text: 'TToastLit', link: '/components/TToastLit' },
          { text: 'TStatusBarLit', link: '/components/TStatusBarLit' },
          { text: 'TStatusFieldLit', link: '/components/TStatusFieldLit' }
        ]
      },
      {
        text: 'Navigation Components',
        items: [
          { text: 'TUserMenuLit', link: '/components/TUserMenuLit' }
        ]
      },
      {
        text: 'References',
        items: [
          { text: 'Spinner Types', link: '/components/spinner-list' }
        ]
      }
    ],

    search: {
      provider: 'local'
    }
  },

  // Output directory
  outDir: '../public/docs',

  // Don't fail on dead links (for now)
  ignoreDeadLinks: true,

  // Configure Vite
  vite: {
    server: {
      fs: {
        // Allow serving files from project root
        allow: ['../..']
      }
    },
    build: {
      rollupOptions: {
        external: [
          /^\/js\//,
          /^\/css\//
        ]
      }
    }
  }
})
