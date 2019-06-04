<template>
  <div class="st-todo" @mouseenter="showTools = true;" @mouseleave="showTools = false;">
    <div class="st-todo-content" @click="!editing && setCollapse(!collapsed)">
      <span v-if="!editing">{{snip.title}}</span>
      <a-input v-if="editing" size="small" placeholder="snippet title" v-model="snip.title" />
    </div>
    <div class="st-todo-tools" v-show="showTools">
      <a-button shape="circle" size="small" icon="edit" title="edit" v-show="!editing" @click="beginEdit"></a-button>
      <a-button shape="circle" size="small" icon="check" title="confirm" v-show="editing" @click="confirmEdit"></a-button>
      <a-button shape="circle" size="small" type="danger" icon="delete" title="delete" :disabled="editing" @click="remove"></a-button>
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
  private todo: MyTodo | null = null;
  private showTools: boolean = false;
  private editing: boolean = false;

  created() {
    this.todo = _.cloneDeep(this.todoItem);
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
    min-width: @unit * 11;
    margin-left: @unit;
    align-self: center;
    button + button {
      margin-left: @unit;
    }
  }
}

.st-todo {
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  border: 1px solid #e8e8e8;
  text-align: left;
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  }
  
  &-body {
    padding: @unit;
    word-break: break-word;
    & > pre {
      margin: 0;
    }
    & textarea {
      white-space: pre;
    }
  }
  & + & {
    margin-top: @unit;
  }
}

</style>
