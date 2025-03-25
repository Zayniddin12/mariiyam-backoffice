<template>
  <label
    :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
    :style="{ minHeight: computedSize, '--btn-size': computedBtnSize }"
    class="transition group flex-center-between relative select-none min-h-[20px] w-full bg-gray-100 p-2 pr-3 rounded-xl border border-transparent hover:border-primary"
    @click="handleChange"
  >
    <slot name="label">
      <span class="transition-200 text-base" :class="[labelStyles]">
        {{ label }}
      </span>
    </slot>
    <slot name="value">
      <span
        class="before:w-3 before:h-3 shrink-0 duration-200 ease-in-out mr-1.5 before:opacity-0 relative border-2 rounded-full box-border before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:transition-all before:duration-200 border-[#C8CFD6]"
        :class="[
          computedBtnStyles,
          radioClass,
          {
            'before:opacity-100 before:!bg-blueDark !border-blueDark':
              modelValue === value,
          },
        ]"
        :style="{ width: computedSize, height: computedSize }"
      />
    </slot>
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: string | number | object;
  value?: string | number | object;
  label: string | number | object;
  name?: string | number;
  disabled?: boolean;
  size?: string | number;
  btnStyles?: string;
  labelStyles?: string;
  radioClass?: string;
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 24,
  btnStyles:
    "group-hover:border-primary peer-checked:border-primary peer-checked:before:!bg-white",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | object | boolean): void;
}>();

const handleChange = () => {
  emit("update:modelValue", props.value);
};

const computedSize = computed(() => props.size + "px");

const computedBtnSize = computed(() => +props.size * 0.5 + "px");

const computedBtnStyles = computed(() =>
  !props.disabled ? props.btnStyles : "peer-checked:before:!bg-gray-100"
);
</script>
