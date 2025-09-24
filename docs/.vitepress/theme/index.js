import DefaultTheme from 'vitepress/theme'
import './terminal.css'
import ButtonDemo from './components/ButtonDemo.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register the ButtonDemo component globally
    app.component('ButtonDemo', ButtonDemo)

    // Configure Vue to work with web components
    app.config.compilerOptions.isCustomElement = (tag) => {
      return tag.startsWith('terminal-') || tag.startsWith('t-')
    }
  }
}