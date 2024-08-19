<script setup >
const { register, login } = useStrapiAuth()
const router = useRouter()
const route = useRoute()

const { values, defineField } = useForm();
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

console.log(route.path)

const signUp = async () => {
  try {

    await register({ username: values.email, email: values.email, password: values.password})
    router.push('/dashboard')
  } catch (e) {
    console.log('there was an error')
  }
}
const loginUser = async () => {
  try {
    await login({identifier: 'someg@gmail.com', password: 'password101'})
    router.push('/dashboard')
  } catch (error) {
    console.log(error)
  }
}

</script>

<template>
  <div class="flex justify-center items-center w-screen custom_height">
    <div class="container-mdc">
      <div>
        <div>
          <h2 class="text-xl mb-6">Login </h2>
        </div>
        <div class="mdc-text-field mdc-text-field--filled mb-4">
          <input id="email" v-model="email" v-bind="emailAttrs" type="text" class="mdc-text-field__input" placeholder="Enter your email" />
          <label for="email" class="mdc-floating-label">Email</label>
          <span class="mdc-line-ripple"></span>
          <img src="@/assets/cancel-icon.svg" alt="Cancel Icon" class="cancel-icon" @click="clearForm" />
        </div>
        <div class="mdc-text-field mdc-text-field--filled mb-8">
          <input id="password" v-model="password" v-bind="passwordAttrs" type="text" class="mdc-text-field__input" placeholder="Create a password" />
          <label for="password" class="mdc-floating-label">Password</label>
          <span class="mdc-line-ripple"></span>
          <img src="@/assets/cancel-icon.svg" alt="Cancel Icon" class="cancel-icon" @click="clearForm" />
        </div>
        <div>
          <button @click="loginUser" class="mdc-button mdc-button--raised w-full mb-4">
            Login
          </button>
          <p class="text-right">Need an account? <NuxtLink to="/signup" class="text-underline text-blue-800">SIGN UP</NuxtLink></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom_height {

 height:  calc(100vh - 89px);
}

</style>