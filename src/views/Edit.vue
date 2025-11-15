<template>
  <div id="editarea">
    
    <h1>更新文章内容</h1><br>
    <div id="title">
    <b class="text">标题</b>
    <el-input placeholder="Title" clearable />
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
    <el-button type="primary" @click="onSubmit">保存</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

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
