import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//全局组件
import test from '@/components/test/test.js';
Vue.use(test);




// console.log(navigator);
Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
    router,
    render: h => h(App)
  })
  .$mount('#app')
