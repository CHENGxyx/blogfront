<template>
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
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios';
import { ElMessage } from 'element-plus'
import router from '@/router';
const username = ref('')
const password = ref('')
const handleLogin = async () => {
  if (!username.value || !password.value) {
    ElMessage.warning('账号和密码不能为空！');
    return;
  }

  try {
    const response = await axios.post(
    'http://localhost:8080/api/login',
    {
    "username": username.value,
    "password": password.value
    }
    );

    if (response.data.success) { 
      router.push('/home');   
    } else {
      ElMessage.error(response.data.message || '登录失败，请检查账号和密码。');
      console.error('登录失败：', response.data);
    }
  } catch (error) {
    ElMessage.error('请求出错，请稍后再试。');
    console.error('登录请求出错：', error);
  }
};
</script>
<style scoped>
.submit {
  margin-top: 28px;
}
</style>