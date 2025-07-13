export const useFirebase = () => {
  const { $firebase } = useNuxtApp()
  const auth = $firebase.auth
  const provider = $firebase.provider
  const strapiAuth = useStrapiAuth()
  const router = useRouter()

  const loginWithGoogle = async () => {
    try {
      const { signInWithPopup } = await import('firebase/auth')
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log('🟢 Firebase sign-in result:', result)

      if (!user?.email || !user?.displayName) {
        alert('Google did not return email or name.')
        return
      }

      const res = await $fetch('/api/stripe/confirm-social', {
        method: 'POST',
        body: {
          email: user.email,
          name: user.displayName,
          uid: user.uid,
          provider: 'google'
        }
      })

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
