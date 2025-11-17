<template>
  <div id="editarea">
    
    <h1>编写文章内容</h1><br>
    <div id="title">
    <b class="text">标题</b>
    <el-input 
    v-model="title"
    placeholder="Title"
    clearable 
    />
    </div>
    <div id="content">
    <b class="text">文章内容</b><br>
    <el-input
    v-model="textarea"
    style="width: 500px"
    :rows="20"
    type="textarea"
    placeholder="Please input your content"
    />
    </div>
    <el-button type="primary" @click="submit">确认</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

const title = ref('')
const textarea = ref('')

const submit = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    ElMessage.error('您尚未登录或认证已过期，请先登录！');
    router.push('/');
    return;
  }

  if (!title.value.trim() || !textarea.value.trim()) {
    ElMessage.warning('文章标题和内容不能为空！');
    return;
  }

  try {
    const response = await axios.post(
      'http://localhost:8080/api/articles',
      {
        "title": title.value,
        "content": textarea.value
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.data.code === 200) { 
      ElMessage.success('文章发布成功!');
      title.value = '';
      textarea.value = '';
      router.push(`/article/${response.data.data.id}`);
    } else {
      ElMessage.error(response.data.message || '文章发布失败!');
    }
  } catch (error: any) {
    console.error('文章发布失败:', error);
  }
}
</script>

<style scoped>
h1 {
  font-size: 50px;
}
.editarea {
  display: flex;
  justify-content: center;
}
.text {
  font-size: 20px;
}
button {
  margin-top: 20px;
}
</style>
