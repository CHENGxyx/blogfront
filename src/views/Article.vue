<template>
  <div class="article-detail-container">
    <el-page-header @back="goBack" content="文章详情">
      <template #extra>
        <div style="display: flex; gap: 10px;">
          <el-button v-if="isAuthor" @click="editArticle" type="primary">编辑</el-button>
          <el-button v-if="isAuthor" @click="deleteArticle" type="danger">删除</el-button>
        </div>
      </template>
    </el-page-header>
    <el-card v-loading="isLoading" class="article-card">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
        <span v-if="article.author && article.author.username" style="margin-right: 15px;">
          <el-icon><User /></el-icon> 作者: {{ article.author.username }}
        </span>
        <span><el-icon><Clock /></el-icon> 发布于: {{ article.formattedCreatedAt }}</span>
        <span v-if="article.formattedUpdatedAt && article.formattedUpdatedAt !== article.formattedCreatedAt" style="margin-left: 15px;">
          <el-icon><RefreshRight /></el-icon> 更新于: {{ article.formattedUpdatedAt }}
        </span>
      </div>
      <el-divider />
      <div class="article-content" v-html="article.content"></div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import axios from 'axios';

interface Author {
  id: number;
  username: string;
  email: string;
}

interface ArticleDetail {
  id: number;
  title: string;
  content: string;
  user_id: number;
  author: Author;
  created_at: string;
  updated_at: string;
  formattedCreatedAt?: string;
  formattedUpdatedAt?: string;
}

const props = defineProps<{
  id: string;
}>();

const router = useRouter();

const article = ref<ArticleDetail>({
  id: 0, title: '', content: '', user_id: 0,
  author: { id: 0, username: '', email: '' },
  created_at: '', updated_at: ''
});
const isLoading = ref(true);
const currentLoggedInUserId = ref<number | null>(null);

const isAuthor = computed(() => {
  return currentLoggedInUserId.value !== null && article.value.user_id === currentLoggedInUserId.value;
});

const formatDate = (isoString: string | undefined): string => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return isoString.split(' ')[0] || '';
    }
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
  } catch (e) {
    return isoString.split(' ')[0] || '';
  }
};

const fetchArticleDetail = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`http://localhost:8080/api/articles/${props.id}`);

    if (response.data.code === 200 && response.data.data) {
      const data = response.data.data;
      article.value = {
        ...data,
        formattedCreatedAt: formatDate(data.created_at),
        formattedUpdatedAt: formatDate(data.updated_at),
      };
    } else {
      ElMessage.error(response.data.message || '获取文章详情失败!');
      router.push('/home/' + (localStorage.getItem('username') || 'User'));
    }
  } catch (error: any) {
    ElMessage.error('发生未知错误或请求失败!');
    router.push('/home/' + (localStorage.getItem('username') || 'User'));
  } finally {
    isLoading.value = false;
  }
};

const deleteArticle = async () => {
  try {
    await ElMessageBox.confirm('此操作将永久删除该文章, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    const response = await axios.delete(`http://localhost:8080/api/articles/${props.id}`);

    if (response.data.code === 200) {
      ElMessage.success('文章删除成功!');
      router.push('/home/' + (localStorage.getItem('username') || 'User'));
    } else {
      ElMessage.error(response.data.message || '删除文章失败!');
    }
  } catch (error: any) {
    if (error === 'cancel') {
      ElMessage.info('已取消删除');
    } else {
      ElMessage.error('删除文章失败!');
    }
  }
};

onMounted(() => {
  if (props.id) {
    fetchArticleDetail();
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      currentLoggedInUserId.value = parseInt(storedUserId);
    }
  } else {
    ElMessage.error('未获取到文章id');
    router.push('/home/' + (localStorage.getItem('username') || 'User'));
  }
});

const goBack = () => {
  router.back();
};

const editArticle = () => {
  router.push(`/edit/${props.id}`);
};
</script>

<style scoped>
.article-detail-container {
  width: 100%;
  min-height: calc(100vh - var(--header-height, 0px) - var(--footer-height, 0px));
  padding: 20px;
  box-sizing: border-box;
  background-color: skyblue;
  color: white;
}

.article-card {
  margin: 20px auto;
  background-color: white;
  color: black;
  border: 1px solid #555;
}

.article-title {
  font-size: 2.5em;
  text-align: center;
  margin-bottom: 20px;
  color: #5d9cec;
}

.article-meta {
  display: flex;
  justify-content: center;
  font-size: 0.9em;
  color: #bbb;
  margin-bottom: 20px;
}

.article-meta .el-icon {
  vertical-align: middle;
  margin-right: 5px;
}

.el-divider {
  background-color: #555;
}

.article-content {
  font-size: 1.1em;
  line-height: 1.8;
  padding: 0 15px;
  word-wrap: break-word;
}

.article-content :deep(p) {
  margin-bottom: 1em;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3) {
  margin-top: 1.5em;
  margin-bottom: 0.8em;
  color: #a0cfff;
}

.el-page-header {
  margin-bottom: 20px;
  color: white;
}

.el-page-header :deep(.el-page-header__content),
.el-page-header :deep(.el-page-header__back .el-page-header__icon) {
  color: white;
}

.el-page-header :deep(.el-page-header__title) {
  color: #5d9cec;
}
</style>