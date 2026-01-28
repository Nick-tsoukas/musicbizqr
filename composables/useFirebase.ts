export const useFirebase = () => {
  const { $firebase } = useNuxtApp()
  const auth = $firebase.auth
  const provider = $firebase.provider
  const strapiAuth = useStrapiAuth()
  const router = useRouter()
  
  async function loginWithGoogle() {
    try {
      const { signInWithPopup, signOut } = await import('firebase/auth')
      
      // Sign out first to force account picker to show
      await signOut(auth)
      
      // Force account selection every time
      provider.setCustomParameters({
        prompt: 'select_account'
      })
      
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log('🟢 Firebase sign-in result:', result)
  
      if (!user?.email) {
        alert('Google did not return an email address.')
        return
      }
  
      // Get Firebase ID token (good practice for auth)
      const idToken = await user.getIdToken(true)
  
      const payload = {
        email: user.email,
        name: user.displayName || '',
        uid: user.uid,
        provider: 'google'
      }
  
      console.log('[confirm-social] POST →', payload)
  
      // Call Nuxt server route (not Strapi) - handles Stripe customer + trial creation
      const res = await $fetch('/api/stripe/confirm-social', {
        method: 'POST',
        body: payload,
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      })
  
      console.log('[confirm-social] RESP ←', res)
  
      if (res?.jwt) {
        await strapiAuth.setToken(res.jwt)
        await strapiAuth.fetchUser()
        router.push('/dashboard')
      } else {
        console.error('Missing JWT in response', res)
        alert('Signup succeeded, but we couldn’t log you in. Please try again.')
      }
    } catch (err: any) {
      console.error('Google login error:', err)
      console.error('Error message:', err?.message)
      console.error('Error data:', err?.data)
      console.error('Error status:', err?.status || err?.statusCode)
      
      // Show more specific error message
      const errorMsg = err?.data?.message || err?.message || 'Unknown error'
      alert(`Google login failed: ${errorMsg}`)
    }
  }
  

  return { loginWithGoogle }
}
