<template>
  <div class="st-todo" @mouseenter="showTools = true;" @mouseleave="showTools = false;">
    <div class="st-todo-content">
      <a-checkbox v-if="!editing" @change="onCheckChanged($event)" :class="todo.finished ? 'checked' : ''" :checked="checked">{{todo.content}}</a-checkbox>
      <a-input v-if="editing" size="small" placeholder="todo content" v-model="todo.content" />
    </div>
    <div class="st-todo-tools" v-show="showTools">
      <a-button shape="circle" size="small" icon="edit" title="edit" v-show="!editing" @click="beginEdit"></a-button>
      <a-button shape="circle" size="small" icon="check" title="confirm" v-show="editing" @click="confirmEdit"></a-button>
      <a-button shape="circle" size="small" type="danger" icon="delete" title="delete" v-if="!todo.finished" :disabled="editing" @click="remove"></a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { remote } from 'electron';
import _ from 'lodash';
import MyTodo from '@/classes/MyTodo';

@Component({
})
export default class TodoItem extends Vue {
  @Prop() private todoItem!: MyTodo;
  @Prop() private checked!: boolean;
  private todo: MyTodo | null = null;
  private showTools: boolean = false;
  private editing: boolean = false;

  created() {
    this.todo = _.cloneDeep(this.todoItem);
  }

  onCheckChanged(e: any) {
    if (this.todo) {
      this.todo.finished = e.target.checked;
      this.$emit('checkChanged', this.todo);
    }
  }

  beginEdit() {
    this.editing = true;
  }

  confirmEdit() {
    this.editing = false;
    this.$emit('update', this.todo);
  }

  remove() {
    this.$emit('delete', this.todo);
  }
}
</script>

<style scoped lang="less">
@import url(../less/const.less);

.st-todo {
  min-height: 42px;
  background: rgba(24, 144, 255, 0.05);
  padding: @unit;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 2px;
  border: 1px solid #e8e8e8;
  text-align: left;
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  }
  &-content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: bold;
    flex: auto;
    align-self: center;
  }
  &-tools {
    min-width: @unit * 3;
    margin-left: @unit;
    align-self: center;
    button + button {
      margin-left: @unit;
    }
  }
  & + & {
    margin-top: @unit;
  }
  & .checked {
    text-decoration: line-through;
    font-style: italic;
  }
}

</style>
