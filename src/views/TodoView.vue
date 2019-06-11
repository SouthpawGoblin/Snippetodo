<template>
  <div id="todo-view">
    <VuePerfectScrollbar ref="scroll">
      <div class="todo-list">
        <TodoItem 
          v-for="todo in todos" 
          :key="todo.id" 
          :todo-item="todo"
          @update="updateTodo"
          @delete="deleteTodo">
        </TodoItem>
      </div>
    </VuePerfectScrollbar>
    <div class="todo-textarea">
      <a-textarea 
        placeholder="Input TODO content, Ctrl+Enter to submit." 
        :autosize="{ minRows: 6, maxRows: 6 }" 
        v-model="newTodoContent"
        @pressEnter="onPressEnter($event)"/>
      <a-button type="primary" icon="check" title="submit" class="h-100 ml-1" @click="createTodo"></a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import _ from 'lodash';
import TodoItem from '@/components/TodoItem.vue';
import MyTodo from '@/classes/MyTodo';
import { ADD_TODO, UPDATE_TODO, DELETE_TODO } from '@/store/mutation-types';
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

@Component({
  components: {
    TodoItem,
    VuePerfectScrollbar
  },
})
export default class TodoView extends Vue {
  private todos: MyTodo[] = this.$store.getters.todos;
  private newTodoContent: string = '';

  createTodo() {
    if (!this.newTodoContent.length) return;
    const newTodo = new MyTodo(this.newTodoContent);
    this.$store.dispatch(ADD_TODO, newTodo);
    this.newTodoContent = '';
  }

  updateTodo(todo: MyTodo) {
    this.$store.dispatch(UPDATE_TODO, todo);
  }

  deleteTodo(todo: MyTodo) {
    this.$store.dispatch(DELETE_TODO, todo);
    this.updateScroll();
  }

  updateScroll() {
    Vue.nextTick(() => {
      (this.$refs.scroll as any).update();
    });
  }

  onPressEnter(e: any) {
    if (e.ctrlKey) {
      this.createTodo();
    }
  }
}
</script>

<style scoped lang="less">
@import url(../less/const.less);

#todo-view {
  margin-top: @unit * 2;
  flex: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  & .todo-list {
    flex: auto;
    overflow-x: hidden; 
    overflow-y: auto;
  }
  & .todo-textarea {
    margin-top: @unit * 2;
    min-height: @unit * 17;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: relative;
    & .ant-alert {
      width: 100%;
      position: absolute;
      top: -@unit * 6;
    }
    & > textarea {
      resize: none;
      white-space: pre;
    }
  } 
}
</style>

