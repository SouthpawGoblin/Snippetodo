<template>
  <div class="st-snippet">
    <div class="st-snippet-title">
      <span>{{snippet.title}}</span>
    </div>
    <div class="st-snippet-content">
      <span>{{snippet.content}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MySnippet from '@/classes/MySnippet';

@Component({
})
export default class Snippet extends Vue {
  @Prop() private snippet!: MySnippet;
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
  &-title {
    height: @unit * 4;
    border-bottom: 1px solid #e8e8e8;
    padding: @unit;
  }
  &-content {
    padding: @unit;
  }
}

</style>
