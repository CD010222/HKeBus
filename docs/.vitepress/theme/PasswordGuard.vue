<script setup>
import { ref, onMounted } from 'vue'

const PASSWORD = 'hkebus2026'
const STORAGE_KEY = 'hkebus_auth'

const isAuthenticated = ref(false)
const password = ref('')
const errorMsg = ref('')
const loading = ref(true)

const checkAuth = () => {
  const auth = localStorage.getItem(STORAGE_KEY)
  if (auth === 'true') {
    isAuthenticated.value = true
  }
  loading.value = false
}

const handleSubmit = () => {
  if (password.value === PASSWORD) {
    isAuthenticated.value = true
    localStorage.setItem(STORAGE_KEY, 'true')
    errorMsg.value = ''
  } else {
    errorMsg.value = '密码错误，请重试'
    password.value = ''
  }
}

const handleLogout = () => {
  isAuthenticated.value = false
  localStorage.removeItem(STORAGE_KEY)
  password.value = ''
}

onMounted(() => {
  checkAuth()
})
</script>

<template>
  <div v-if="loading" class="password-loading">
    <div class="loading-spinner"></div>
  </div>
  <div v-else-if="!isAuthenticated" class="password-guard">
    <div class="password-card">
      <div class="password-icon">🔒</div>
      <h2 class="password-title">访问验证</h2>
      <p class="password-desc">请输入访问密码以继续</p>
      <form @submit.prevent="handleSubmit" class="password-form">
        <input
          v-model="password"
          type="password"
          class="password-input"
          placeholder="请输入密码"
          autofocus
        />
        <p v-if="errorMsg" class="password-error">{{ errorMsg }}</p>
        <button type="submit" class="password-btn">确认</button>
      </form>
    </div>
  </div>
  <slot v-else></slot>
</template>

<style scoped>
.password-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.password-guard {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  z-index: 9999;
}

.password-card {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 40px 48px;
  text-align: center;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  width: 360px;
}

.password-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.password-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 8px;
}

.password-desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0 0 24px;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.password-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.password-input:focus {
  border-color: var(--vp-c-brand-1);
}

.password-input::placeholder {
  color: var(--vp-c-text-3);
}

.password-error {
  color: var(--vp-c-danger-1);
  font-size: 13px;
  margin: -8px 0 0;
}

.password-btn {
  width: 100%;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  background: var(--vp-c-brand-1);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.password-btn:hover {
  background: var(--vp-c-brand-2);
}
</style>
