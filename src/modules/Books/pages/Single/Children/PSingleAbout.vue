<template>
  <div v-html="book?.description" />
</template>
<script setup lang="ts">
import { useBooksStore } from "@/modules/Books/store";
import { computed } from "vue";

const bookStore = useBooksStore();
const book = computed(() => bookStore?.book);
</script>
