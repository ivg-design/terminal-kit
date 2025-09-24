// Setup script to load terminal components
export async function setupComponents() {
  if (typeof window !== 'undefined') {
    try {
      // Import all component modules
      const modules = import.meta.glob('/js/components/*.js')

      for (const path in modules) {
        try {
          await modules[path]()
          console.log(`Loaded component: ${path}`)
        } catch (error) {
          console.warn(`Failed to load component ${path}:`, error)
        }
      }
    } catch (error) {
      console.error('Failed to setup components:', error)
    }
  }
}