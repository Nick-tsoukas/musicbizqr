<script setup >
const { register, login } = useStrapiAuth()
const router = useRouter()
const { values, defineField } = useForm();

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const signUp = async () => {
  try {
    console.log(value.emai, values.passwordl)
    await register({ username: values.email, email: values.email, password: values.password})
    router.push('/dashboard')
  } catch (e) {
    console.log('there was an error')
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
          <input v-model="email" v-bind="emailAttrs" id="email" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your email" />
        </div>
        <div class="mb-8">
          <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password:</label>
          <input v-model="password" v-bind="passwordAttrs" id="password" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Create a password" />
        </div>
        <div >
          <button @click="register" class="btn w-full mb-4">
            Sign up
          </button>
          <p class="text-right">Already have an account? <NuxtLink to="login" class="text-underline text-blue-800 ">LOGIN</NuxtLink></p>
        </div>
      </div>
    </div>
      
    
   </div>
  
  
</template>
