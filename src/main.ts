import './assets/main.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import hljs from 'highlight.js/lib/core';

import 'highlight.js/lib/languages/javascript';

import App from './App.vue'
import router from './router'

const app = createApp(App)

VMdEditor.use(vuepressTheme, {
    Hljs: hljs,
});

VMdPreview.use(vuepressTheme, {
    Hljs: hljs,
});

VMdPreview.use(vuepressTheme, {
    Hljs: hljs,
});
app.use(VMdPreview);

app.use(VMdEditor);
app.use(router)

app.use(ElementPlus as any)
app.mount('#app')
