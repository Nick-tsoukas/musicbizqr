<script setup >
const { register, login } = useStrapiAuth()
const router = useRouter()
const route = useRoute()

const { values, defineField } = useForm();
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const signUp = async () => {
  try {
    console.log(values.email, values.password)
    await register({ username: values.email, email: values.email, password: values.password })
    router.push('/dashboard')
  } catch (e) {
    console.error('Registration error:', e.response ? e.response.data : e)
  }
}


</script>

<template>
  
   <div class="flex justify-center items-center w-screen h-screen" >
    <div class="flex flex-col w-[80vw]  rounded shadow-md p-8 border border-neon-purpule">
      <div>
        <div>
          <h2 class="text-xl mb-6">Sign up</h2>
        </div>
        <div class="mb-4">
          <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input id="email" v-model="email" v-bind="emailAttrs" type="text" class="mdc-text-field__input" placeholder="Enter your email" />
        </div>
        <div class="mb-8">
          <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password:</label>
          <input id="password" v-model="password" v-bind="passwordAttrs" type="text" class="mdc-text-field__input" placeholder="Create a password" />
        </div>
        <div >
          <button @click="signUp" class="btn w-full mb-4">
            Sign up
          </button>
          <p class="text-right">Already have an account? <NuxtLink to="login" class="text-underline text-blue-800 ">LOGIN</NuxtLink></p>
        </div>
      </div>
    </div>
      
    
   </div>
  
  
</template>
