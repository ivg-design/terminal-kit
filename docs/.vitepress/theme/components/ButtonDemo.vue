<template>
  <div class="button-demo">
    <div class="demo-section">
      <h3>Button Variants</h3>
      <div class="demo-row">
        <t-btn>Default Button</t-btn>
        <t-btn variant="primary">Primary Button</t-btn>
        <t-btn variant="success">Success Button</t-btn>
        <t-btn variant="danger">Danger Button</t-btn>
        <t-btn variant="warning">Warning Button</t-btn>
      </div>
    </div>

    <div class="demo-section">
      <h3>Button Sizes</h3>
      <div class="demo-row">
        <t-btn size="small">Small</t-btn>
        <t-btn>Default</t-btn>
        <t-btn size="large">Large</t-btn>
      </div>
    </div>

    <div class="demo-section">
      <h3>Button States</h3>
      <div class="demo-row">
        <t-btn>Normal</t-btn>
        <t-btn disabled>Disabled</t-btn>
        <t-btn loading>Loading</t-btn>
      </div>
    </div>

    <div class="demo-section">
      <h3>Interactive Example</h3>
      <div class="demo-row">
        <t-btn @click="handleClick">{{ clickText }}</t-btn>
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
          await loadScript('/public/docs/js/components/TComponent.js')
          await loadScript('/public/docs/js/utils/StyleSheetManager.js')
          await loadScript('/public/docs/js/utils/ComponentLogger.js')
          await loadScript('/public/docs/js/components/TPanel.js')
          await loadScript('/public/docs/js/components/TButton.js')

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