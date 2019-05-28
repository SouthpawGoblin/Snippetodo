<template>
  <div id="snippet-view">
    <div class="snippet-list">
      <Snippet 
        v-for="snippet in snippets" 
        :key="snippet.id" 
        :snippet="snippet"
        @copy="copySnippet" 
        @update="updateSnippet"
        @delete="deleteSnippet">
      </Snippet>
    </div>
    <div class="snippet-textarea">
      <a-textarea placeholder="snippet content" :autosize="{ minRows: 6, maxRows: 6 }" v-model="newSnippetContent"/>
      <a-button type="primary" icon="check" title="submit" class="h-100 ml-1" @click="createSnippet"></a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Snippet from '@/components/Snippet.vue';
import MySnippet from '../classes/MySnippet';
import { ADD_SNIPPET, UPDATE_SNIPPET, DELETE_SNIPPET } from '../store/mutation-types';

@Component({
  components: {
    Snippet
  },
})
export default class SnippetView extends Vue {
  private snippets: MySnippet[] = this.$store.getters.snippets;
  private newSnippetContent: string = '';

  copySnippet(success: boolean) {
    if (success) {
      this.$message.success('Copy Success!');
    } else {
      this.$message.success('Copy Failed');
    }
  }

  createSnippet() {
    if (!this.newSnippetContent.length) return;
    const title = this.newSnippetContent.split('\n')[0].slice(0, 20);
    const newSnippet = new MySnippet(title, this.newSnippetContent);
    this.$store.dispatch(ADD_SNIPPET, newSnippet);
    this.newSnippetContent = '';
  }

  updateSnippet(snippet: MySnippet) {
    this.$store.dispatch(UPDATE_SNIPPET, snippet);
  }

  deleteSnippet(snippet: MySnippet) {
    this.$store.dispatch(DELETE_SNIPPET, snippet);
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
    & > textarea {
      resize: none;
      white-space: pre;
    }
  } 
}
</style>

