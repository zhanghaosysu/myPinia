<script setup>
import { useCounterStore } from "./stores/counter";
const store = useCounterStore();

const {increment} = store
</script>
<template>
  <div>计数器：{{ store.count }}</div>
  <button @click="increment(2)">累加</button>
  <div>双倍: {{ store.double }}</div>
  <!-- 这种方式可以修改，但是不建议，一般修改状态都是希望统一逻辑来修改 -->
</template>
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
