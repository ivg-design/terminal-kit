<template>
  <div class="button-demo">
    <div class="demo-section">
      <h3>Button Variants</h3>
      <div class="demo-row">
        <terminal-button>Default Button</terminal-button>
        <terminal-button variant="primary">Primary Button</terminal-button>
        <terminal-button variant="success">Success Button</terminal-button>
        <terminal-button variant="danger">Danger Button</terminal-button>
        <terminal-button variant="warning">Warning Button</terminal-button>
      </div>
    </div>

    <div class="demo-section">
      <h3>Button Sizes</h3>
      <div class="demo-row">
        <terminal-button size="small">Small</terminal-button>
        <terminal-button>Default</terminal-button>
        <terminal-button size="large">Large</terminal-button>
      </div>
    </div>

    <div class="demo-section">
      <h3>Button States</h3>
      <div class="demo-row">
        <terminal-button>Normal</terminal-button>
        <terminal-button disabled>Disabled</terminal-button>
        <terminal-button loading>Loading</terminal-button>
      </div>
    </div>

    <div class="demo-section">
      <h3>Interactive Example</h3>
      <div class="demo-row">
        <terminal-button @click="handleClick">{{ clickText }}</terminal-button>
        <span class="click-counter">Clicked: {{ clickCount }} times</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ButtonDemo',
  setup() {
    const clickCount = ref(0)
    const clickText = ref('Click Me!')

    const handleClick = () => {
      clickCount.value++
      clickText.value = 'Clicked!'
      setTimeout(() => {
        clickText.value = 'Click Me!'
      }, 500)
    }

    onMounted(async () => {
      // Load terminal components via script tags in the browser
      if (typeof window !== 'undefined') {
        try {
          const loadScript = (src) => {
            return new Promise((resolve, reject) => {
              const script = document.createElement('script')
              script.type = 'module'
              script.src = src
              script.onload = resolve
              script.onerror = reject
              document.head.appendChild(script)
            })
          }

          const loadCSS = (href) => {
            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = href
            document.head.appendChild(link)
          }

          // Load CSS
          loadCSS('/public/docs/css/theme.css')
          loadCSS('/public/docs/css/components/buttons.css')

          // Load JS modules in order
          await loadScript('/public/docs/js/components/TerminalComponent.js')
          await loadScript('/public/docs/js/utils/StyleSheetManager.js')
          await loadScript('/public/docs/js/utils/ComponentLogger.js')
          await loadScript('/public/docs/js/components/TerminalButton.js')

          console.log('TerminalButton component loaded')
        } catch (error) {
          console.error('Failed to load TerminalButton:', error)
        }
      }
    })

    return {
      clickCount,
      clickText,
      handleClick
    }
  }
}
</script>

<style scoped>
.button-demo {
  padding: 20px;
  background: var(--terminal-bg-light);
  border: 1px solid var(--terminal-gray);
  margin: 20px 0;
}

.demo-section {
  margin-bottom: 30px;
}

.demo-section h3 {
  color: var(--terminal-green);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--terminal-gray);
}

.demo-row {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.click-counter {
  color: var(--terminal-green-dim);
  font-size: 12px;
  font-family: var(--font-mono);
}
</style>