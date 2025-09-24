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
      { text: 'Demos', link: 'http://localhost:12358/' },
      { text: 'Icons', link: 'http://localhost:12358/demos/icons.html' },
      { text: 'GitHub', link: 'https://github.com/ivg-design/terminal-kit' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'API Reference', link: '/API' }
        ]
      },
      {
        text: 'Components',
        items: [
          { text: 'TButton', link: '/components/TButton' },
          { text: 'TerminalButton', link: '/components/TerminalButton' },
          { text: 'TerminalColorPicker', link: '/components/TerminalColorPicker' },
          { text: 'TerminalDropdown', link: '/components/TerminalDropdown' },
          { text: 'TerminalDynamicControls', link: '/components/TerminalDynamicControls' },
          { text: 'TerminalInput', link: '/components/TerminalInput' },
          { text: 'TerminalLoader', link: '/components/TerminalLoader' },
          { text: 'TerminalModal', link: '/components/TerminalModal' },
          { text: 'TerminalPanel', link: '/components/TerminalPanel' },
          { text: 'TerminalSlider', link: '/components/TerminalSlider' },
          { text: 'TerminalStatusBar', link: '/components/TerminalStatusBar' },
          { text: 'TerminalTextarea', link: '/components/TerminalTextarea' },
          { text: 'TerminalToast', link: '/components/TerminalToast' },
          { text: 'TerminalToggle', link: '/components/TerminalToggle' },
          { text: 'TerminalTreeView', link: '/components/TerminalTreeView' },
          { text: 'TerminalUserMenu', link: '/components/TerminalUserMenu' }
        ]
      },
      {
        text: 'Guides',
        items: [
          { text: 'Component Creation', link: '/COMPONENT_CREATION_GUIDE' },
          { text: 'Data Manager API', link: '/components/DataManager_API' }
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