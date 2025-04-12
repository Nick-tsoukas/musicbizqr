<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-white shadow-md rounded p-6">
      <h2 class="text-2xl font-semibold mb-4">My Account</h2>

      <!-- Profile Update Section -->
      <section class="mb-8 border-b pb-4">
        <h3 class="text-xl font-semibold mb-2">Profile</h3>
        <p v-if="fetchingProfile" class="text-gray-500">Loading profile...</p>
        <div v-else>
          <!-- Name -->
          <div class="mb-4">
            <label class="block text-gray-600 mb-1">Name</label>
            <input
              type="text"
              v-model="profileForm.name"
              class="w-full border rounded px-3 py-2"
            />
          </div>
          <!-- Email -->
          <div class="mb-4">
            <label class="block text-gray-600 mb-1">Email</label>
            <input
              type="text"
              v-model="profileForm.email"
              class="w-full border rounded px-3 py-2"
            />
          </div>

          <button
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            @click="updateProfile"
          >
            Update Profile
          </button>
        </div>
      </section>

      <!-- Password Change Section -->
      <section>
        <h3 class="text-xl font-semibold mb-2">Change Password</h3>
        <div class="mb-4">
          <label class="block text-gray-600 mb-1">Current Password</label>
          <input
            type="password"
            v-model="passwordFormData.currentPassword"
            class="w-full border rounded px-3 py-2"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-600 mb-1">New Password</label>
          <input
            type="password"
            v-model="passwordFormData.password"
            class="w-full border rounded px-3 py-2"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-600 mb-1">Confirm New Password</label>
          <input
            type="password"
            v-model="passwordFormData.passwordConfirmation"
            class="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          @click="onChangePassword"
        >
          Update Password
        </button>
        <div v-if="passwordError" class="text-red-600 mt-2">
          {{ passwordError }}
        </div>
        <div v-if="passwordSuccess" class="text-green-600 mt-2">
          {{ passwordSuccess }}
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStrapiAuth, useStrapiClient } from '#imports' 
// ^ Removed useStrapiUser (unused) to avoid conflicts

const { user, fetchUser, changePassword } = useStrapiAuth()
const client = useStrapiClient()

// Loading state for the profile section
const fetchingProfile = ref(true)

// Profile form
const profileForm = ref({ name: '', email: '' })

// Password form data (renamed to avoid VarRedeclaration conflicts)
const passwordFormData = ref({
  currentPassword: '',
  password: '',
  passwordConfirmation: ''
})

// Feedback states for the password section
const passwordError = ref('')
const passwordSuccess = ref('')

onMounted(async () => {
  try {
    // If user not yet fetched, fetch it now
    if (!user.value) {
      await fetchUser()
    }
    // Populate the profile form once user is available
    if (user.value) {
      profileForm.value.name = user.value.username || user.value.name || ''
      profileForm.value.email = user.value.email || ''
    }
  } finally {
    fetchingProfile.value = false
  }
})

async function updateProfile() {
  try {
    // Example endpoint & payload: adjust as needed
    await client('/users/me', {
      method: 'PUT',
      body: {
        username: profileForm.value.name,
        email: profileForm.value.email,
      },
    })
    alert('Profile updated successfully!')
    // Refresh user data
    await fetchUser()
  } catch (err: any) {
    console.error(err)
    alert(err.message || 'Failed to update profile')
  }
}

async function onChangePassword() {
  passwordError.value = ''
  passwordSuccess.value = ''

  try {
    await changePassword({
      currentPassword: passwordFormData.value.currentPassword,
      password: passwordFormData.value.password,
      passwordConfirmation: passwordFormData.value.passwordConfirmation
    })
    // Clear form
    passwordFormData.value = { currentPassword: '', password: '', passwordConfirmation: '' }
    passwordSuccess.value = 'Password updated successfully!'
  } catch (err: any) {
    console.error(err)
    passwordError.value = err.message || 'Failed to change password'
  }
}
</script>
