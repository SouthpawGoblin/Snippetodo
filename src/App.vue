<template>
  <a-locale-provider :locale="zh_CN">
    <div id="app" class="p-2">
      <a-radio-group defaultValue="snippet" buttonStyle="solid" @change="switchMode" class="w-100">
        <a-radio-button value="snippet" class="w-50">Snippets</a-radio-button>
        <a-radio-button value="todo" class="w-50">TODOs</a-radio-button>
      </a-radio-group>
      <router-view></router-view>
    </div>
  </a-locale-provider>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'

@Component({
  name: 'app',
  components: {
  },
})
export default class Snippetodo extends Vue {
  public zh_CN: any = zh_CN;

  created() {
    this.$router.push({name: 'snippet'});
  }

  switchMode(e: any) {
    this.$router.push({name: e.target.value});
  }
}
</script>

<style lang="less">
@import url(./less/common.less);

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  .h-100;
  .text-center;
}
</style>
