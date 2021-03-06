<template>
  <div id="snippet-view">
    <VuePerfectScrollbar ref="scroll" v-show="snippets.length > 0">
      <div class="snippet-list">
        <Snippet 
          v-for="snippet in snippets" 
          :key="snippet.id" 
          :snippet="snippet"
          @copy="copySnippet" 
          @update="updateSnippet"
          @delete="deleteSnippet"
          @collapseChanged="updateScroll">
        </Snippet>
      </div>
    </VuePerfectScrollbar>
    <div class="list-placeholder" v-show="snippets.length === 0">
      <a-icon class="ph-icon" type="book" />
      <p class="ph-text">no snippet yet ~</p>
    </div>
    <div class="snippet-textarea">
      <a-alert v-if="showSuccessAlert" message="Snippet Copied!" type="success" showIcon />
      <a-alert v-if="showErrorAlert" message="Copy Failed" type="error" showIcon />
      <a-textarea 
        placeholder="Input snippet content here, Ctrl+Enter to submit." 
        :autosize="{ minRows: 6, maxRows: 6 }" 
        v-model="newSnippetContent"
        @pressEnter="onPressEnter($event)"/>
      <a-button type="primary" icon="check" title="submit" class="h-100 ml-1" @click="createSnippet"></a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import _ from 'lodash';
import Snippet from '@/components/Snippet.vue';
import MySnippet from '../classes/MySnippet';
import { ADD_SNIPPET, UPDATE_SNIPPET, DELETE_SNIPPET } from '../store/mutation-types';
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

@Component({
  components: {
    Snippet,
    VuePerfectScrollbar
  },
})
export default class SnippetView extends Vue {
  private snippets: MySnippet[] = this.$store.getters.snippets;
  private newSnippetContent: string = '';
  private showSuccessAlert: boolean = false;
  private showErrorAlert: boolean = false;

  copySnippet(success: boolean) {
    if (success) {
      this.showAlert('success');
    } else {
      this.showAlert('error');
    }
  }

  createSnippet() {
    if (!this.newSnippetContent.length) return;
    let title = '';
    for (let line of this.newSnippetContent.split('\n')) {
      title = line.trim().slice(0, 100);
      if (title.length > 0) {
        break;
      }
    }
    title = title.length > 0 ? title : '(Blank Snippet)';
    const newSnippet = new MySnippet(title, this.newSnippetContent);
    this.$store.dispatch(ADD_SNIPPET, newSnippet);
    this.newSnippetContent = '';
  }

  updateSnippet(snippet: MySnippet) {
    this.$store.dispatch(UPDATE_SNIPPET, snippet);
  }

  deleteSnippet(snippet: MySnippet) {
    this.$store.dispatch(DELETE_SNIPPET, snippet);
    this.updateScroll();
  }

  updateScroll() {
    Vue.nextTick(() => {
      (this.$refs.scroll as any).update();
    });
  }

  showAlert(type: 'success' | 'error') {
    if (type === 'success') {
      this.showSuccessAlert = true;
      setTimeout(() => {this.showSuccessAlert = false}, 2000);
    } else if (type === 'error') {
      this.showErrorAlert = true;
      setTimeout(() => {this.showErrorAlert = false}, 2000);
    }
  }

  onPressEnter(e: any) {
    if (e.ctrlKey) {
      this.createSnippet();
    }
  }
}
</script>

<style scoped lang="less">
@import url(../less/const.less);

#snippet-view {
  margin-top: @unit * 2;
  flex: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  & .snippet-list {
    flex: auto;
    overflow-x: hidden; 
    overflow-y: auto;
  }
  & .snippet-textarea {
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

