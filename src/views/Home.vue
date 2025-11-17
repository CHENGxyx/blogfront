<template>
  <div>
    <h1 style="color: #0080ff ">{{ $route.params.username }}, welcome! </h1>
    
    <div class="header-buttons-container">
      <el-button type="primary" @click="buildnew">
        <el-icon><Edit /></el-icon>
        新建文章
      </el-button>
      <el-button type="danger" @click="logout">
        <el-icon><SwitchButton /></el-icon>
        退出登录
      </el-button>
    </div>

    <el-divider/>

    <h2 class="table-title" style="color: #0080ff;">所有文章 ({{ articles.length }})</h2>

    <div v-if="isLoading" class="loading-state">
      <el-skeleton :rows="5" animated />
      <p>文章加载中...</p>
    </div>

    <div v-else-if="articles.length === 0" class="empty-state">
      <el-empty description="暂时还没有文章哦,快去创建第一篇吧!" />
      <el-button type="primary" @click="buildnew">
        <el-icon><Plus /></el-icon>
        创建新文章
      </el-button>
    </div>

    <div v-else class="article-table-wrapper">
      <el-table :data="articles" style="color: #0080ff" class="my-table" @row-click="handleRowClick">
        <el-table-column prop="title" label="标题" class-name="title-column">
          <template #default="scope">
            <span @click.stop="viewArticle(scope.row.id)" class="article-title-link">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="formattedCreatedAt" label="创建时间" width="200" class-name="date-column"></el-table-column>
        <el-table-column prop="formattedUpdatedAt" label="更新时间" width="200" class-name="date-column"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import axios from 'axios';
import { ref, onMounted, defineProps } from 'vue';
import router from '@/router';
import { ElMessage, ElButton, ElDivider, ElEmpty, ElSkeleton, ElTable, ElTableColumn } from 'element-plus';
import { Edit, SwitchButton, Clock, Plus, RefreshRight } from '@element-plus/icons-vue';

const username = ref('User');
const route = useRoute();
interface Props {
  username: string;
}
const props = defineProps<Props>();
const buildnew = () => {
  router.push('/Write');
};

const displayUsername = ref(props.username || localStorage.getItem('username') || 'User'); 
const currentUserId = ref<number | null>(null);
const articles = ref<Article[]>([]);
const isLoading = ref(true);

interface Article {
  id: number;
  title: string;
  content: string;
  user_id: number;
  author?: {
    id: number;
    username: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  formattedCreatedAt?: string;
  formattedUpdatedAt?: string;
}

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

const fetchUserInfo = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    ElMessage.warning('未登录');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    router.push('/');
    return false;
  }

  try {
    const response = await axios.get('http://localhost:8080/api/user/info', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.code === 200 && response.data.data) {
      const userData = response.data.data;
      displayUsername.value = userData.username; 
      currentUserId.value = userData.id;

      localStorage.setItem('username', userData.username);
      localStorage.setItem('userId', userData.id.toString());
      return true;
    }
  } catch (error: any) {
    ElMessage.error('未登录')
  }
};

const fetchArticles = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      ElMessage.error('未登录');
      router.push('/');
      return;
    }
    const response = await axios.get('http://localhost:8080/api/articles', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.code === 200 && response.data.data) {
      const allArticles: Article[] = response.data.data;

      articles.value = allArticles.map(article => ({
        ...article,
        formattedCreatedAt: formatDate(article.created_at),
        formattedUpdatedAt: formatDate(article.updated_at),
      }));

      if (articles.value.length === 0) {
        ElMessage.info('目前还没有任何文章');
      }
    } else {
      ElMessage.error(response.data.message || '获取文章列表失败！');
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ElMessage.error('发生错误');
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (props.username) {
    displayUsername.value = props.username;
  }

  const userFetched = await fetchUserInfo();

  if (userFetched && currentUserId.value !== null) {
    await fetchArticles();
  } else if (!userFetched) {
    articles.value = [];
  }
});

const handleRowClick = (row: Article) => {
  viewArticle(row.id);
};

const viewArticle = (articleId: number) => {
  router.push(`/article/${articleId}`);
};

const logout = () => {
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
  localStorage.removeItem('token');

  ElMessage.success('已成功退出登录！');
  router.push('/');
};
</script>

<style scoped>
div {
  background-color: #cef5ff;
  color: white;
  padding: 20px;
}
h1 {
  margin-bottom: 20px;
}
#buildnew {
  text-align: right;
  margin-right: 20px;
}
button {
  margin-top: 20px;
  margin-bottom: 20px;
}

.header-buttons-container {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: -10px; 
  margin-right: 20px;
}
.table-title {
  text-align: center;
  color: white;
  margin-bottom: 20px;
  font-size: 1.8em;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 50px 0;
  color: #bbb;
}

.article-table-wrapper {
  max-width: 960px;
  margin: 0 auto;
}

.my-table {
  background-color: #27a7f1;
  color: white;
  border-radius: 8px;
  overflow: hidden;
}

.my-table :deep(.el-table__header-wrapper) {
  background-color: #6fa1ff;
}

.my-table :deep(.el-table__header-wrapper th) {
  background-color: #1c88c7;
  color: white;
  border-bottom: 1px solid #555;
}

.my-table :deep(.el-table__body-wrapper tr) {
  background-color: skyblue;
  color: white;
}

.my-table :deep(.el-table__body-wrapper tr:hover) {
  background-color: #555;
  cursor: pointer;
}

.my-table :deep(.el-table__body-wrapper td) {
  border-bottom: 1px solid #555;
}

.article-title-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
}

.article-title-link:hover {
  text-decoration: underline;
}

.title-column {
  font-size: 1.1em;
}

.date-column {
  font-size: 0.95em;
  color: #bbb;
}

@media (max-width: 768px) {
  .header-buttons-container {
    flex-direction: column;
    align-items: center;
    margin-right: 0;
  }
}
</style>