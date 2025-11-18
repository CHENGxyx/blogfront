<template>
  <div id="editarea">
    
    <h1>更新文章内容</h1><br>
    <div id="title">
    <b class="text">标题</b>
    <el-input v-model="title" placeholder="Title" clearable />
    </div>
    <div id="content">
    <b class="text">文章内容</b><br>
    <v-md-editor
    v-model="textarea"
    height="500px"
    placeholder="Please input your content">
    </v-md-editor>
    </div>
    <el-button type="primary" @click="onSubmit">保存</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});
const router = useRouter();
const title = ref('');
const textarea = ref('');
const isLoading = ref<boolean>(false);
const fetchArticleDetail = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      ElMessage.error('未登录');
      router.push('/');
      return;
    }
    const response = await axios.get(
      `http://localhost:8080/api/articles/${props.id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    if (response.data.code === 200 && response.data.data) {
      const data = response.data.data;
      title.value = data.title;
      textarea.value = data.content;
    } else {
      ElMessage.error(response.data.message || '获取文章失败!');
      router.back();
    }
  } catch (error: any) {
    ElMessage.error('获取文章详情失败!');
    router.back();
  } finally {
    isLoading.value = false;
  }
};
const onSubmit = async () => {
  if (!props.id) {
    ElMessage.error('未获取到文章ID');
    return;
  }
  if (!title.value.trim() || !textarea.value.trim()) {
    ElMessage.warning('文章标题和内容不能为空!');
    return;
  }
  const token = localStorage.getItem('token');
  if (!token) {
    ElMessage.error('未登录');
    router.push('/');
    return;
  }
  try {
    const response = await axios.put(
      `http://localhost:8080/api/articles/${props.id}`,
      {
        title: title.value,
        content: textarea.value
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    if (response.data.code === 200) {
      ElMessage.success('文章更新成功');
      router.push(`/Article/${props.id}`);
    }
  } catch (error: any) {
    ElMessage.error('更新文章失败');
  }
};

onMounted(() => {
  if (props.id) {
    fetchArticleDetail();
  } else {
    ElMessage.error('未获取到文章id');
    router.back();
  }
});
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
