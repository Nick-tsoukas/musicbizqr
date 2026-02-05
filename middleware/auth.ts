export default defineNuxtRouteMiddleware((to) => {
  const user = useStrapiUser()
  
  // If user is not authenticated, redirect to home page
  if (!user.value) {
    return navigateTo('/')
  }
})
