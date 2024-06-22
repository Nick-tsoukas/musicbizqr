<script setup >
const { register, login } = useStrapiAuth()
const router = useRouter()
const { values, defineField } = useForm();

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

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
    await login({identifier: 'someg@gmail.com', password: 'jkjkjkjkjkjkjkjfdfd'})
    router.push('/dashboard')
  } catch (error) {
    console.log(error)
  }
}

</script>

<template>
  
   <div class="flex justify-center items-center w-screen h-screen" >
    <div class="flex flex-col w-[80vw]">
      <div>
        <div class="m-4">
          <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input v-model="email" v-bind="emailAttrs" id="email" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your email" />
        </div>
        <div class="m-4">
          <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password:</label>
          <input v-model="password" v-bind="passwordAttrs" id="password" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Create a password" />
        </div>
        <div class="flex justify-between">
          <button @click="loginUser" class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            Sign Up
          </button>
          <button @click="loginUser" class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            Login
          </button>
        </div>
      </div>
    </div>
      
    
   </div>
  
  
</template>
