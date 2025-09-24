import DefaultTheme from 'vitepress/theme'
import './terminal.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Configure Vue to work with web components
    app.config.compilerOptions.isCustomElement = (tag) => {
      return tag.startsWith('terminal-') || tag.startsWith('t-')
    }
  }
}