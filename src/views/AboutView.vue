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
  <div>
    <h3>邮箱</h3>
    <el-input
    v-model="email"
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
    <el-button type="Register" @click="handleRegister">Register</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import router from '@/router';
import axios from 'axios';
import { ElMessage } from 'element-plus'
const username = ref('')
const email = ref('')
const password = ref('')
const handleRegister = async () => {
  if (!username.value || !password.value || !email.value) {
    ElMessage.warning('账号,邮箱和密码不能为空！');
    return;
  }

  try {
    const response = await axios.post(
    'http://localhost:8080/api/register',
    {
    "username": username.value,
    "password": password.value,
    "email": email.value
    }
    );

    if (response.data.success) { 
      router.push('/');   
    } else {
      ElMessage.error(response.data.message || '注册失败，请检查账号和密码。');
      console.error('注册失败：', response.data);
    }
  } catch (error) {
    ElMessage.error('请求出错，请稍后再试。');
    console.error('注册请求出错：', error);
  }
};
</script>
<style scoped>
.submit {
  margin-top: 28px;
}
</style>