<template>
  <div class="home-container">
    <el-menu mode="horizontal" :ellipsis="false" class="main-menu">
      <el-menu-item index="0">
        <h1 class="welcome-text">{{ displayUsername }}, welcome! </h1>
      </el-menu-item>
      <div class="flex-grow" />
      <el-button type="primary" @click="buildnew">
        <el-icon><Edit /></el-icon>
        新建文章
      </el-button>
      <el-button type="danger" @click="logout">
        <el-icon><SwitchButton /></el-icon>
        退出登录
      </el-button>
    </el-menu>

    <div class="section-container">
      <h2 class="section-title">我的文章 ({{ myArticles.length }})</h2>
      <div v-if="isLoadingMyArticles" class="loading-state">
        <el-skeleton :rows="3" animated />
        <p>我的文章加载中...</p>
      </div>
      <div v-else-if="myArticles.length === 0" class="empty-state">
        <el-empty description="暂时还没有自己的文章" />
        <el-button type="primary" @click="buildnew">
          <el-icon><Plus /></el-icon>
          创建新文章
        </el-button>
      </div>
      <div v-else class="articles-grid">
        <el-card v-for="article in myArticles" :key="article.id" class="article-card" @click="viewArticle(article.id)">
          <template #header>
            <div class="card-header">
              <span class="card-title">{{ article.title }}</span>
              <el-button class="button" text @click.stop="viewArticle(article.id)">查看</el-button>
            </div>
          </template>
          <p class="card-content-preview">{{ article.content.substring(0, 100) + (article.content.length > 100 ? '...' : '') }}</p>
          <div class="card-footer">
            <span class="author-info"><el-icon><User /></el-icon> {{ article.author?.username || '未知' }}</span>
            <span class="time-info"><el-icon><Clock /></el-icon> {{ article.formattedCreatedAt }}</span>
          </div>
        </el-card>
      </div>
    </div>

    <el-divider/>

    <div class="section-container">
      <h2 class="section-title">其他人的文章 ({{ allOtherArticles.length }})</h2>
      <div v-if="isLoadingAllArticles" class="loading-state">
        <el-skeleton :rows="5" animated />
        <p>所有文章加载中...</p>
      </div>
      <div v-else-if="allOtherArticles.length === 0" class="empty-state">
        <el-empty description="暂时还没有其他人的文章哦" />
      </div>
      <div v-else class="articles-grid">
        <el-card v-for="article in allOtherArticles" :key="article.id" class="article-card" @click="viewArticle(article.id)">
          <template #header>
            <div class="card-header">
              <span class="card-title">{{ article.title }}</span>
              <el-button class="button" text @click.stop="viewArticle(article.id)">查看</el-button>
            </div>
          </template>
          <p class="card-content-preview">{{ article.content.substring(0, 100) + (article.content.length > 100 ? '...' : '') }}</p>
          <div class="card-footer">
            <span class="author-info"><el-icon><User /></el-icon> {{ article.author?.username || '未知' }}</span>
            <span class="time-info"><el-icon><Clock /></el-icon> {{ article.formattedCreatedAt }}</span>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import router from '@/router';
import { ElMessage, ElButton, ElDivider, ElEmpty, ElSkeleton, ElMenu, ElMenuItem, ElCard } from 'element-plus';
import { Edit, SwitchButton, Clock, Plus, RefreshRight, User } from '@element-plus/icons-vue';

const route = useRoute();

interface Props {
  username: string;
}
const props = defineProps<Props>();

const displayUsername = ref(props.username || localStorage.getItem('username') || 'User');
const currentUserId = ref<number | null>(null);

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

const myArticles = ref<Article[]>([]);
const allOtherArticles = ref<Article[]>([]);
const isLoadingMyArticles = ref(true);
const isLoadingAllArticles = ref(true);

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

const fetchMyArticles = async (userId: number) => {
  isLoadingMyArticles.value = true;
  try {
    const response = await axios.get(`http://localhost:8080/api/articles/user/${userId}`);
    if (response.data.code === 200 && response.data.data) {
      myArticles.value = response.data.data.map((article: Article) => ({
        ...article,
        formattedCreatedAt: formatDate(article.created_at),
        formattedUpdatedAt: formatDate(article.updated_at),
      }));
    } else {
      ElMessage.error(response.data.message || '获取我的文章失败');
    }
  } catch (error) {
    console.error('获取我的文章失败:', error);
  } finally {
    isLoadingMyArticles.value = false;
  }
};

const fetchAllArticles = async () => {
  isLoadingAllArticles.value = true;
  try {
    const response = await axios.get('http://localhost:8080/api/articles');
    if (response.data.code === 200 && response.data.data) {
      allOtherArticles.value = response.data.data
        .filter((article: Article) => article.user_id !== currentUserId.value)
        .map((article: Article) => ({
            ...article,
            formattedCreatedAt: formatDate(article.created_at),
            formattedUpdatedAt: formatDate(article.updated_at),
        }));
    } else {
      ElMessage.error(response.data.message || '获取所有文章失败');
    }
  } catch (error) {
    console.error('获取所有文章失败:', error);
  } finally {
    isLoadingAllArticles.value = false;
  }
};

const buildnew = () => {
  router.push('/write');
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  ElMessage.success('已退出登录');
  router.push('/');
};

const viewArticle = (id: number) => {
  router.push(`/article/${id}`);
};

onMounted(async () => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    currentUserId.value = parseInt(userId);
    await Promise.all([
      fetchMyArticles(currentUserId.value),
      fetchAllArticles(),
    ]);
  } else {
    ElMessage.error('请重新登录。');
    router.push('/');
  }
});
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #66CCFF;
  color: #0051ff;
  min-height: 100vh;
  border-radius: 10px;
}

.main-menu {
  background-color: white;
  border-bottom: 1px solid #444;
  margin-bottom: 20px;
  color: #f0f0f0;
  border-radius: 10px;
}

.welcome-text {
  font-size: 1.5em;
  color: #5d9cec;
  margin: 0;
  padding: 0 20px;
  line-height: var(--el-menu-item-height);
}

.el-button {
  margin-top: 15px;
  margin-right:10px
}

.flex-grow {
  flex-grow: 1;
}

.section-container {
  margin-bottom: 40px;
}

.section-title {
  text-align: center;
  font-size: 2em;
  color: #0080ff;
  margin-bottom: 25px;
  margin-top: 30px;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.article-card {
  background-color: white;
  border: 1px solid #555;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(192, 193, 207, 0.4);
}

.article-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-radius: 10px;
  border-bottom: 1px solid #bbc4d3;
  background-color: #d5dfff;
}

.article-card .card-title {
  font-size: 1.2em;
  font-weight: bold;
  color: #0080ff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
  margin-right: 10px;
}

.article-card .card-content-preview {
  padding: 15px 20px;
  font-size: 0.95em;
  line-height: 1.6;
  color: #66CCFF;
  min-height: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-card .card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-top: 1px solid #444;
  background-color: #d5dfff;
  font-size: 0.85em;
  color: black;
  border-radius: 10px;
}

.author-info, .time-info {
  display: flex;
  align-items: center;
}

.el-icon {
  margin-right: 5px;
  vertical-align: middle;
}

.el-divider {
  margin: 50px 0;
  background-color: #666;
  height: 2px;
}

.empty-state {
  text-align: center;
  padding: 50px 0;
}

.empty-state .el-empty {
  --el-empty-text-color: #ccc;
  --el-empty-image-width: 150px;
}

.loading-state {
  padding: 20px;
  color: #ccc;
  text-align: center;
}
</style>