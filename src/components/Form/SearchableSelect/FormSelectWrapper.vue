<template>
  <div class="relative">
    <button @click="handleClick" class="w-full" :disabled="disabled">
      <slot name="trigger">
        <div>Trigger</div>
      </slot>
    </button>
    <Transition name="select-transition">
      <div
        ref="select"
        v-if="isOpen && !disabled"
        :class="wrapperClass"
        class="absolute bg-white rounded-lg overflow-hidden max-h-[300px] w-full overflow-y-auto select-shadow z-40 min-w-fit"
      >
        <slot name="options" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { defineModel, watch } from "vue";

interface Props {
  withTrigger?: boolean;
  show: boolean;
  wrapperClass?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});
const emit = defineEmits<{ (e: "click"): void }>();

const handleClick = () => {
  isOpen.value = true;
  emit("click");
};

// const select = ref();
// onClickOutside(select, () => {
//   if (!props.withTrigger) {
//     toggleSelect(false);
//   }
// });

const isOpen = defineModel("show", { required: true, type: Boolean });

const toggleSelect = (value: boolean) => {
  isOpen.value = value;
};

watch(
  () => props.show,
  (value) => {
    if (value) {
      toggleSelect(true);
    } else {
      toggleSelect(false);
    }
  },
  {
    immediate: true,
  }
);
</script>

<style scoped>
.select-shadow {
  box-shadow: 0 6px 24px 0 rgba(136, 152, 170, 0.8);
}

.select-transition-enter-active {
  animation: select-transition 0.2s ease-out;
}

.select-transition-leave-active {
  animation: select-transition 0.2s ease-in reverse;
}

@keyframes select-transition {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
