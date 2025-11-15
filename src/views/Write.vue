<template>
  <div id="editarea">
    
    <h1>编写文章内容</h1><br>
    <div id="title">
    <b class="text">标题</b>
    <el-input 
    v-model="content"
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

const title = ref('')
const content = ref('')
const submit = async () => {
  const response = await axios.post(
    'http://localhost:8080/api/articles',
    {
      "title": title.value,
      "content": textarea.value
    }
    );
    if (response.data.success) { 
      ElMessage.success('文章发布成功！');
    }else{
      ElMessage.error('文章发布失败！');
    }
}

const textarea = ref('')

const onSubmit = () => {
  console.log('submit!')
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
