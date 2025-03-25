<template>
  <div class="relative" ref="select">
    <!-- SELECTED OPTIONS -->
    <div
      class="transition-200 px-3 h-10 py-[9px] bg-gray-100 transition-all duration-300 border border-transparent cursor-pointer flex items-center justify-between rounded-lg"
      tabindex="1"
      :class="[
        selectedOptionStyles,
        error ? '!border-red-500 bg-red-100' : '',
        { 'focus-within:border-gray-100': disabled, disabled: disabled },
        headStyles,
      ]"
      @click="toggleSelect(!showOptions)"
    >
      <slot name="selectedOption" :value="value">
        <p
          v-if="!value.length"
          class="text-dark-100 select-none text-sm leading-140"
          :class="{ '!text-gray': disabled }"
        >
          {{ placeholder }}
        </p>
        <div
          v-else
          class="select-none text-sm text-dark-100 leading-140 line-clamp-1 flex flex-wrap"
          :class="{ '!text-gray': disabled }"
        >
          <span
            v-for="(val, idx) in value"
            :key="idx"
            class="mr-2 mb-1 bg-blue-100 text-blue-800 px-2 py-1 rounded"
          >
            {{ val[labelKey] || val }}
            <span class="ml-1 cursor-pointer" @click.stop="removeOption(val)">
              &times;
            </span>
          </span>
        </div>

        <slot name="chevron">
          <span
            class="icon-chevron-down flex-center h-4 transition-200 text-base text-gray-700 inline-block shrink-0"
            :class="{ '!rotate-180': showOptions }"
          >
          </span>
        </slot>
      </slot>
    </div>
    <!-- OPTIONS -->
    <Transition name="fade">
      <ul
        v-if="showOptions && !disabled"
        :key="showOptions"
        :class="fromTop ? 'bottom-[65px]' : 'top-full'"
        class="absolute p-2 w-full bg-white border border-white-100 z-[3] translate-y-3 overflow-y-auto max-h-[300px] text-white rounded-md shadow-select"
      >
        <slot name="options">
          <template v-if="options.length">
            <li
              v-for="(option, idx) in options"
              :key="idx"
              class="transition-300 cursor-pointer rounded hover:bg-gray-800"
              @click="onSelect(option)"
              :class="{ rounded: isActive(option) }"
            >
              <slot name="option" :option="option" :index="idx">
                <p class="flex-y-center justify-between py-2 px-3">
                  <span class="text-dark text-[13px]">
                    {{ option[labelKey] }}
                  </span>
                </p>
              </slot>
            </li>
          </template>

          <template v-else>
            <p class="text-center text-gray-400 text-sm py-8">
              {{ $t("no_groups_found") }}
            </p>
          </template>
        </slot>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { nextTick, onMounted, ref, watch } from "vue";
import { TClassName } from "@/types/common";
type TOption = string | number | { [key: string]: string | number };

export interface Props {
  modelValue?: TOption[];
  options: TOption[];
  labelKey: string;
  valueKey: string;
  placeholder?: string;
  selectedOptionStyles?: TClassName;
  selectedStyles?: TClassName;
  headStyles?: TClassName;
  dark?: boolean;
  error?: boolean;
  disabled?: boolean;
  activeIcon?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  labelKey: "name",
  valueKey: "id",
  options: [] as TOption[], // Ensure options is always an array
});

const emit = defineEmits<{
  (e: "on-toggle", value: boolean): void;
  (e: "update:modelValue", value: TOption[]): void;
  (e: "load"): void;
  (e: "on-select", value: TOption): void;
}>();

const showOptions = ref(false);
const fromTop = ref(false);
function toggleSelect(newValue = showOptions.value) {
  if (props.options.length > 1) {
    showOptions.value = newValue;
  }
  emit("on-toggle", showOptions.value);
}

function findOption(option: TOption) {
  return props.options?.find(
    (o) => o === option || o[props.valueKey] === option
  );
}

const value = ref<TOption[]>(props.modelValue || []);
function onSelect(option: TOption) {
  if (isActive(option)) {
    value.value = value.value.filter(
      (val) => val !== option && val[props.valueKey] !== option[props.valueKey]
    );
  } else {
    value.value.push(option);
  }
  emit("update:modelValue", value.value);
  emit("on-select", option);
}

function removeOption(option: TOption) {
  value.value = value.value.filter(
    (val) => val !== option && val[props.valueKey] !== option[props.valueKey]
  );
  emit("update:modelValue", value.value);
}

const select = ref();
onClickOutside(select, () => toggleSelect(false));

function isActive(option: TOption) {
  return value.value.some(
    (val) =>
      val === option ||
      (typeof val === "object" &&
        val[props.valueKey] === option[props.valueKey])
  );
}

watch(
  () => props.modelValue,
  (newValue) => {
    value.value = newValue || [];
  },
  { immediate: true }
);
function checkTop() {
  const bounds = select.value.getBoundingClientRect();
  const distanceToBottom = window.innerHeight - bounds.bottom;
  const threshold = 300;
  if (distanceToBottom < threshold) {
    fromTop.value = true;
  } else {
    fromTop.value = false;
  }
}
onMounted(() => {
  nextTick(() => {
    checkTop();
  });
});
</script>

<style scoped>
.disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
