import DefaultTheme from 'vitepress/theme'
import './terminal.css'
import DocIcon from './DocIcon.js'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DocIcon', DocIcon)
    // Configure Vue to work with web components
    app.config.compilerOptions.isCustomElement = (tag) => {
      return tag.startsWith('terminal-') || tag.startsWith('t-')
    }
  }
}
