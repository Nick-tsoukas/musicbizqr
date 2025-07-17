export const useFirebase = () => {
  const { $firebase } = useNuxtApp()
  const auth = $firebase.auth
  const provider = $firebase.provider
  const strapiAuth = useStrapiAuth()
  const router = useRouter()

  const {
    public: { strapiUrl }
  } = useRuntimeConfig()
  
  async function loginWithGoogle() {
    try {
      const { signInWithPopup } = await import('firebase/auth')
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log('🟢 Firebase sign-in result:', result)
  
      if (!user?.email) {
        alert('Google did not return an email address.')
        return
      }
  
      // OPTIONAL: check backend route with HEAD/GET to see if it exists
      try {
        const headResp = await $fetch.raw('/api/stripe/confirm-social', {
          baseURL: strapiUrl,
          method: 'GET' // harmless probe
        })
        console.log('[confirm-social] GET probe status:', headResp.status)
      } catch (probeErr) {
        console.warn('[confirm-social] probe failed:', probeErr)
      }
  
      // Get Firebase ID token (good practice for auth)
      const idToken = await user.getIdToken(true)
  
      const payload = {
        email: user.email,
        name: user.displayName || '',
        uid: user.uid,
        provider: 'google'
      }
  
      console.log('[confirm-social] POST →', strapiUrl, payload)
  
      const res = await $fetch('/api/stripe/confirm-social', {
        baseURL: strapiUrl,
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
    } catch (err) {
      console.error('Google login error:', err)
      alert('Something went wrong during Google login')
    }
  }
  

  return { loginWithGoogle }
}
