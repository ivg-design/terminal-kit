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
      { text: 'Third-Party', link: '/third-party' },
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
          { text: 'TSplitterLit', link: '/components/TSplitterLit' },
          { text: 'TGridLit', link: '/components/TGridLit' },
          { text: 'TTabsLit', link: '/components/TTabsLit' },
          { text: 'TAccordionLit', link: '/components/TAccordionLit' },
          { text: 'TCardLit', link: '/components/TCardLit' }
        ]
      },
      {
        text: 'Display Components',
        items: [
          { text: 'TLoaderLit', link: '/components/TLoaderLit' },
          { text: 'TToastLit', link: '/components/TToastLit' },
          { text: 'TStatusBarLit', link: '/components/TStatusBarLit' },
          { text: 'TStatusFieldLit', link: '/components/TStatusFieldLit' },
          { text: 'TBadgeLit', link: '/components/TBadgeLit' },
          { text: 'TChipLit', link: '/components/TChipLit' },
          { text: 'TAvatarLit', link: '/components/TAvatarLit' },
          { text: 'TProgressLit', link: '/components/TProgressLit' },
          { text: 'TSkeletonLit', link: '/components/TSkeletonLit' },
          { text: 'TTooltipLit', link: '/components/TTooltipLit' }
        ]
      },
      {
        text: 'Navigation Components',
        items: [
          { text: 'TBreadcrumbsLit', link: '/components/TBreadcrumbsLit' },
          { text: 'TUserMenuLit', link: '/components/TUserMenuLit' },
          { text: 'TMenuLit', link: '/components/TMenuLit' },
          { text: 'TTreeLit', link: '/components/TTreeLit' }
        ]
      },
      {
        text: 'Data Components',
        items: [
          { text: 'TListLit', link: '/components/TListLit' },
          { text: 'TTimelineLit', link: '/components/TTimelineLit' },
          { text: 'TKanbanLit', link: '/components/TKanbanLit' },
          { text: 'TCalendarLit', link: '/components/TCalendarLit' },
          { text: 'TChartLit', link: '/components/TChartLit' },
          { text: 'TLogListLit', link: '/components/TLogListLit' },
          { text: 'TLogEntryLit', link: '/components/TLogEntryLit' }
        ]
      },
      {
        text: 'Composite Components',
        items: [
          { text: 'TChatPanelLit', link: '/components/TChatPanelLit' },
          { text: 'TDynamicControlsLit', link: '/components/TDynamicControlsLit' }
        ]
      },
      {
        text: 'References',
        items: [
          { text: 'Spinner Types', link: '/components/spinner-list' },
          { text: 'Third-Party Notices', link: '/third-party' }
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
