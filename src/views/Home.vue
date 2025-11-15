<template>
  <div>
    <h1>{{ routeusername }}, welcome! </h1>
    <div id="buildnew">
      <el-button type="primary" @click="buildnew">新建文章</el-button>
    </div>
    <div id="articles">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column fixed prop="date" label="Date" width="150" />
        <el-table-column prop="title" label="Title" width="120" />
        <el-table-column prop="content" label="Content" width="400" />
        <el-table-column fixed="right" label="Operations" min-width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleDelete(scope.row.id)">
              Delete
            </el-button>
            <el-button link type="primary" size="small" @click="handleEdit(scope.row.id)">
              Edit
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import router from '@/router';
import { ElMessage } from 'element-plus';

const route = useRoute();
const routeusername = ref(route.params.username as string || 'Guest');

const tableData = ref([]);
const currentUserId = ref<number | null>(null);

const formatDate = (isoString: string | undefined): string => {
  if (!isoString) return '';
  return isoString.split(' ')[0]; 
};

const reloadArticles = async () => {
  if (currentUserId.value === null) {
    ElMessage.warning('用户ID未获取，无法加载或刷新文章列表！');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      ElMessage.error('未检测到认证信息，请重新登录！');
      return;
    }

    const response = await axios.get('http://localhost:8080/api/articles', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.code === 200 && response.data.data) {
      const allArticles = response.data.data;
      const userArticles = allArticles.filter((article: any) => 
        article.user_id === currentUserId.value 
      );
      tableData.value = userArticles.map((article: any) => ({
        id: article.id,
        date: formatDate(article.created_at),
        title: article.title,
        content: article.content,
      }));
      if (tableData.value.length === 0) {
        ElMessage.info('您还没有发表任何文章。');
      }
    } else {
      ElMessage.error(response.data.message || '获取文章列表失败！');
    }
  } catch (error: any) {
    console.error('获取文章列表失败:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          ElMessage.error('认证过期，请重新登录！');
        } else {
          ElMessage.error(error.response.data.message || `获取文章失败: ${error.response.status}`);
        }
      } else if (error.request) {
        ElMessage.error('网络错误：无法连接到服务器！');
      } else {
        ElMessage.error('请求设置错误：' + error.message);
      }
    } else {
      ElMessage.error('发生未知错误！');
    }
  }
};

onMounted(async () => {
  const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    currentUserId.value = parseInt(storedUserId, 10);
  } else {
    ElMessage.warning('未检测到用户登录信息，请先登录！');
    return;
  }
  await reloadArticles();
});

const buildnew = () => {
  router.push('/Write');
};

const handleEdit = (articleId: number) => {
  router.push(`/Edit/${articleId}`);
};

const handleDelete = async (articleId: number) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      ElMessage.error('未登录');
      return;
    }

    const response = await axios.delete(`http://localhost:8080/api/articles/:id`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.code === 200) {
      ElMessage.success('文章删除成功！');
      await reloadArticles();
    } else {
      ElMessage.error(response.data.message || '删除失败！');
    }
  } catch (error: any) {
    console.error('删除文章失败:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          ElMessage.error('认证过期，请重新登录！');
        } else {
          ElMessage.error(error.response.data.message || `删除失败: ${error.response.status}`);
        }
      } else if (error.request) {
        ElMessage.error('网络错误：无法连接到服务器！');
      } else {
        ElMessage.error('请求设置错误：' + error.message);
      }
    } else {
      ElMessage.error('发生未知错误！');
    }
  }
};
</script>

<style scoped>
#buildnew {
  text-align: right;
  margin-right: 20px;
}
button {
  margin-top: 20px;
  margin-bottom: 20px;
}
div {
  background-color: #1a1a1a;
  color: white;
  min-height: 100vh;
  padding: 20px;
}
h1 {
  margin-bottom: 20px;
}
</style>