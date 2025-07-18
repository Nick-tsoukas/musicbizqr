export default defineNuxtPlugin(() => {
    const router = useRouter()
  
    router.afterEach((to) => {
      if (window.gtag) {
        window.gtag('config', 'G-LRB82HECE7', {
          page_path: to.fullPath,
        })
      }
    })