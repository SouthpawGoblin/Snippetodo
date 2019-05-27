import Vue from 'vue'
import Router from 'vue-router'
import SnippetView from '@/views/SnippetView.vue'
import TodoView from '@/views/TodoView.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/snippet',
      name: 'snippet',
      component: SnippetView
    },
    {
      path: '/todo',
      name: 'todo',
      component: TodoView
    }
  ]
})
