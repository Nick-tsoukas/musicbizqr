<script setup >
const { register } = useStrapiAuth();
const router = useRouter();
const route = useRoute();

const { values, defineField } = useForm();
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const signUp = async () => {
  // try {
  //   console.log(values.email, values.password);
  //   await register({ username: values.email, email: values.email, password: values.password });
  //   router.push('/dashboard');
  // } catch (e) {
  //   console.error('Registration error:', e.response ? e.response.data : e);
  // }
};
</script>

<template>
  <div
    class="w-full h-screen bg-black flex flex-col justify-center items-center text-white">
    <h1 class="text-5xl">We are <b>Almost</b> there!</h1>
   

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-10 lg:mt-20">

        <div class="bg-transparent border text-center">
            <p class="text-5xl px-10 py-5">20</p>
            <hr>
            <p class="px-10 py-5">days</p>
        </div>

        <div class="bg-transparent border text-center">
            <p class="text-5xl px-10 py-5">03</p>
            <hr>
            <p class="px-10 py-5">hours</p>
        </div>

        <div class="bg-transparent border text-center">
            <p class="text-5xl px-10 py-5">35</p>
            <hr>
            <p class="px-10 py-5">mins</p>
        </div>
        <div class="bg-transparent border text-center">
            <p class="text-5xl px-10 py-5">01</p>
            <hr>
            <p class="px-10 py-5">secs</p>
        </div>
    </div>
    
</div>
  <!-- <div class="flex justify-center items-center w-screen custom_height">
    <div class="container-mdc">
      <div class="bg-white p-8 rounded-sm">
        <div>
          <h2 class="text-xl mb-6 text-black font-semibold">Sign Up</h2>
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
          <button @click="signUp" class="mdc-button mdc-button--raised w-full mb-4">
            Sign Up
          </button>
          <p class="text-right">Already have an account? <NuxtLink to="/login" class="text-underline text-blue-800">LOGIN</NuxtLink></p>
        </div>
      </div>
    </div>
  </div> -->
</template>

<style scoped>
.custom_height {
  height: calc(100vh - 89px);
}



.mdc-text-field__input {
  padding: 0.75rem;
  border: 1px solid #000;
  border-radius: 4px;
  width: 100%;
}

.mdc-button {
  background-color: #6200ee;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
}

.mdc-button:hover {
  background-color: #3700b3;
}

.cancel-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
</style>
