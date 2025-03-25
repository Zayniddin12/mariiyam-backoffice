<template>
  <p
    class="text-xs leading-normal font-medium flex-y-center gap-1"
    :class="statusClass?.class"
  >
    <span class="text-base" :class="statusClass?.icon" /> {{ $t(status) }}
  </p>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  status: "conducted" | "canceled" | "pending" | "held";
}

const props = defineProps<Props>();

const statusClass = computed(() => {
  if (props.status === "conducted") {
    return {
      class: "text-blueDark",
      icon: "icon-tick-circle",
    };
  } else if (props.status === "pending") {
    return {
      class: "text-blue-100",
      icon: "icon-calendar",
    };
  } else if (props.status === "held") {
    return {
      class: "text-[#FF4DE1]",
      icon: "icon-internet",
    };
  } else {
    return {
      class: "text-red",
      icon: "icon-forbidden",
    };
  }
});
</script>

<style scoped></style>
