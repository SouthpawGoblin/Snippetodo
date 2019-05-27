<template>
  <div>
    Snippets
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Snippet from '@/components/Snippet.vue';

@Component({
  components: {
    Snippet
  },
})
export default class SnippetView extends Vue {

}
</script>
