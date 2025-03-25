<template>
  <div>
    <slot name="customOption" v-if="$slots.customOption" />
    <div
      v-else
      class="flex-center-between w-full py-2 cursor-pointer gap-2 px-3 hover:rounded border-b border-gray-400 last:border-none hover:bg-dark-100/[5%]"
      :class="{ 'bg-dark-100/[5%] rounded': active }"
    >
      <div class="flex flex-row items-center gap-2 max-w-full">
        <img
          v-if="withIcon && !imageHasError && icon"
          :src="icon"
          alt="icon"
          class="size-4 object-cover shrink-0"
          @error="onImageError"
          :class="optionIconClass"
        />
        <img
          v-else-if="
            (imageHasError && optionDefaultIcon) || (!icon && withIcon)
          "
          :src="optionDefaultIcon"
          alt="icon"
          class="size-4 object-cover shrink-0"
          :class="defaultOptionIconClass"
        />

        <p
          class="leading-130 text-dark text-sm font-normal truncate max-w-full"
        >
          {{ label }}
        </p>
      </div>

      <slot name="activeIcon" v-if="$slots.activeIcon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  active?: boolean;
  label: string;
  activeIconClass?: string;
  withIcon?: boolean;
  icon?: string;
  optionDefaultIcon?: string;
  optionIconClass?: string;
  defaultOptionIconClass?: string;
}

defineProps<Props>();

const imageHasError = ref(false);

const onImageError = () => {
  imageHasError.value = true;
};
</script>
