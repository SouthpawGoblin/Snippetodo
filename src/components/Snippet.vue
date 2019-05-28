<template>
  <div class="st-snippet">
    <div class="st-snippet-head" @mouseenter="showTools = true;" @mouseleave="showTools = false;">
      <div class="st-snippet-head-title" @click="!editing && (collapsed = !collapsed)">
        <span v-if="!editing">{{snip.title}}</span>
        <a-input v-if="editing" size="small" placeholder="snippet title" v-model="snip.title" />
      </div>
      <div class="st-snippet-head-tools" v-show="showTools">
        <a-button shape="circle" size="small" icon="copy" title="copy" :disabled="editing" @click="copy($event)"></a-button>
        <a-button shape="circle" size="small" icon="edit" title="edit" v-show="!editing" @click="beginEdit"></a-button>
        <a-button shape="circle" size="small" icon="check" title="confirm" v-show="editing" @click="confirmEdit"></a-button>
        <a-button shape="circle" size="small" type="danger" icon="delete" title="delete" :disabled="editing" @click="remove"></a-button>
      </div>
    </div>
    <div class="st-snippet-body" v-show="!collapsed">
      <pre v-if="!editing">{{snip.content}}</pre>
      <a-textarea v-if="editing" placeholder="snippet content" v-model="snip.content" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Clipboard from 'clipboard';
import _ from 'lodash';
import MySnippet from '@/classes/MySnippet';

@Component({
})
export default class Snippet extends Vue {
  @Prop() private snippet!: MySnippet;
  private snip: MySnippet | null = null;
  private collapsed: boolean = true;
  private showTools: boolean = false;
  private editing: boolean = false;

  created() {
    this.snip = _.cloneDeep(this.snippet);
  }

  copy(e: any) {
    const clipboard = new Clipboard(e.target, { 
      text: () => this.snip ? this.snip.content  : ''
    });
    clipboard.on('success', e => {
      this.$emit('copy', true);
      clipboard.off('error');
      clipboard.off('success');
      clipboard.destroy();
    });
    clipboard.on('error', e => {
      this.$emit('copy', false);
      clipboard.off('error');
      clipboard.off('success');
      clipboard.destroy();
    });
    clipboard.onClick(e);
  }

  beginEdit() {
    this.editing = true;
    this.collapsed = false;
  }

  confirmEdit() {
    this.editing = false;
    this.$emit('update', this.snip);
  }

  remove() {
    this.$emit('delete', this.snip);
  }
}
</script>

<style scoped lang="less">
@import url(../less/const.less);

.st-snippet {
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  border: 1px solid #e8e8e8;
  text-align: left;
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  }
  &-head {
    min-height: 42px;
    border-bottom: 1px solid #e8e8e8;
    padding: @unit;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    &-title {
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
