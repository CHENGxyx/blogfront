<template>
  <header>
    注册与登录
  </header>
  <div class="wrapper">

      <nav>
        <RouterLink to="/">Login</RouterLink>
        <RouterLink to="/Register">Register</RouterLink>
      </nav>
    </div>

  <RouterView />
  <div class="input-username">
    <h3>账号</h3>
    <el-input
      v-model="username"
      style="width: 240px"
      placeholder="Please input"
      clearable
    />
  </div>
  <div class="input-password">
    <h3>密码</h3>
  <el-input
    v-model="password"
    style="width: 240px"
    type="password"
    placeholder="Please input password"
    show-password
  />
  </div>
  <div class="submit">
    <el-button type="Login" @click="handleLogin">Login</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios';
import { ElMessage } from 'element-plus'
import router from '@/router';
const username = ref('')
const password = ref('')
const handleLogin = async () => {
  try {
const response = await axios.post(
    'http://localhost:8080/api/login',
    {
    "username": username.value,
    "password": password.value
    }
    );
    console.log(response);
    if (response.data.code === 200) { 
      router.push('/Home'); 
    }
  }
  catch (error) {
    ElMessage.error('登录请求失败！');
    return;
  }
  
}
</script>
<style scoped>
header {
  font-size: 50px;
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}



@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
.submit {
  margin-top: 28px;
}
</style>