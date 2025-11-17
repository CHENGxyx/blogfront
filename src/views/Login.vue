<template>
  <el-card style="max-width: 480px;" class="main">
  <template #header>
    <header style="color: #0080ff">
      注册与登录
    </header>
  </template>  
  <div class="wrapper">

      <nav>
        <RouterLink to="/">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
      </nav>
    </div>

  <RouterView />
  <div class="input-username">
    <h3 style="color: skyblue;">账号</h3>
    <el-input
      v-model="username"
      style="width: 240px"
      placeholder="Please input"
      clearable
    />
  </div>
  <div class="input-password">
    <h3 style="color: skyblue;">密码</h3>
  <el-input
    v-model="password"
    style="width: 240px"
    type="password"
    placeholder="Please input password"
    show-password
  />
  </div>
  <template #footer>
  <div class="submit">
    <el-button type="Login" @click="handleLogin">Login</el-button>
  </div>
  </template>
  </el-card>
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
      const loggedInUsername = response.data.data.user.username;
      localStorage.setItem('userId', response.data.data.user.id.toString());
      localStorage.setItem('token', response.data.data.token);
      router.push({ name:'home', params: { username: loggedInUsername } });
    }
  }
  catch (error) {
    ElMessage.error('请检查账号密码');
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

.main {
  --el-card-bg-color: white;
  border: 5px solid #66CCFF;
  border-radius: 10px;
}

.main :deep(.el-card__header){
  border-bottom:3px solid #66CCFF;
}

.main :deep(.el-card__footer){
  border-top:3px solid #66CCFF;
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
    margin-top: 1px;
  }
}
.submit {
  margin-top: 28px;
}
</style>