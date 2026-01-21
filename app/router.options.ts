import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // Use browser's back/forward saved position
    if (savedPosition) {
      return savedPosition
    }
    // If there's a hash, scroll to that element
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 90
      }
    }
    // Otherwise scroll to top
    return { top: 0, behavior: 'smooth' }
  }
}
