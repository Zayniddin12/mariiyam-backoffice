<template>
  <FormSelectWrapper
    @click="handleFocus"
    ref="select"
    :class="wrapperClass"
    class="w-full"
    v-model:show="showOptions"
    :wrapper-class="fromTop ? '!bottom-[55px]' : '!top-[55px]'"
    :disabled="disabled"
  >
    <template #trigger>
      <FInput
        :readonly="loading || loadingMore"
        v-model="search"
        :placeholder="selectedOptionRef?.[props.labelKey] || placeholder"
        :input-class="[
          inputClass,
          'truncate',
          !showOptions && modelValue ? 'placeholder:!text-dark' : '',
          error
            ? '!border-red bg-red-100'
            : 'focus-within:bg-white focus-within:!border-primary',
          visiblePlaceholder ? 'placeholder:!text-gray-900' : '',
        ]"
        :disabled="disabled"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="searchOption"
      >
        <template v-if="visiblePlaceholder" #prefix>
          <p class="mr-2 truncate text-sm font-normal">
            {{ visiblePlaceholderText }}
          </p>
        </template>
        <template #suffix>
          <Transition name="fade" mode="out-in">
            <div :key="loading">
              <div
                :class="spinnerInputClass"
                class="spinner-input-suffix"
                v-if="loading"
              />
              <slot name="suffix" v-else>
                <Transition name="fade" mode="out-in">
                  <div
                    :key="modelValue"
                    class="flex flex-row items-center"
                    :class="{ 'select-none': disabled }"
                  >
                    <button
                      @click="clearSelect"
                      v-if="hasModelValue && selectedOptionRef"
                      :key="hasModelValue"
                      class="flex group flex-center hover:[&>*]:!text-red size-4 rounded-full transition-200"
                    >
                      <span
                        class="icon-close !text-gray-100 text-[10px] transition-200"
                      />
                    </button>
                    <span
                      v-else
                      :class="{
                        suffixClass,
                        '-rotate-180 !text-blue !mt-0': showOptions,
                      }"
                      class="icon-chevron-down text-[#667779] transition-all h-max duration-200 inline-block text-base"
                    />
                  </div>
                </Transition>
              </slot>
            </div>
          </Transition>
        </template>
      </FInput>
    </template>
    <template #options>
      <Transition name="fade" mode="out-in">
        <div :key="loading">
          <template v-if="$slots.loading && loading">
            <slot name="loading" />
          </template>

          <template v-else-if="loading">
            <div class="flex justify-center h-28 items-center">
              <div class="spinner-select" />
            </div>
          </template>

          <template v-if="!loading">
            <ul class="w-full p-2" :class="optionWrapperClass">
              <FormSelectOption
                v-for="(option, index) in [
                  ...(isAllOption
                    ? [{ name: t('locations_module.status.all'), id: 'all' }]
                    : []),
                  ...options,
                ]"
                :key="index"
                :label="option?.[labelKey] as string"
                :active="option?.[valueKey] === modelValue"
                :icon="option?.[iconKey] as string"
                @click="selectOption(option)"
                :withIcon="withIcon"
                :optionDefaultIcon="optionDefaultIcon"
                :optionIconClass="optionIconClass"
                :defaultOptionIconClass="defaultOptionIconClass"
              >
                <template #activeIcon v-if="$slots.activeIcon">
                  <slot name="activeIcon" :data="option" />
                </template>

                <template #customOption v-if="$slots.customOption">
                  <slot
                    name="customOption"
                    :data="option"
                    :index="index"
                    :last="index === options.length - 1"
                  />
                </template>
              </FormSelectOption>
            </ul>
          </template>

          <template v-if="!loading && options?.length === 0">
            <div
              class="text-sm font-normal flex justify-center h-28 items-center opacity-60 leading-130 text-dark"
            >
              {{ noDataTitle }}
            </div>
          </template>
          <div
            class="h-0.5"
            v-if="
              (paginationData?.next || searchPaginationData.next) && !loading
            "
            v-intersection-observer="onIntersectionObserver"
          />

          <template v-if="$slots.loadingMore && loadingMore && !loading">
            <slot name="loadingMore" />
          </template>

          <template v-else-if="loadingMore && !loading && options?.length">
            <div class="flex items-center justify-center h-3 mb-2 p-2 pt-0">
              <div class="dots"></div>
            </div>
          </template>
        </div>
      </Transition>
    </template>
  </FormSelectWrapper>
</template>

<script setup lang="ts">
import { vIntersectionObserver } from "@vueuse/components";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";

import FInput from "@/components/Form/Input/FInput.vue";
import FormSelectOption from "@/components/Form/SearchableSelect/FormSelectOption.vue";
import FormSelectWrapper from "@/components/Form/SearchableSelect/FormSelectWrapper.vue";
import ApiService from "@/services/ApiService";
import { debounce } from "@/utils";
import { onClickOutside } from "@vueuse/core";
import { PaginationData } from "@/types/common";
import { useI18n } from "vue-i18n";

interface Option {
  [key: string]: any;
}

interface Props {
  labelKey?: string;
  valueKey?: string;
  iconKey?: string;
  modelValue?: any;
  disabled?: boolean;
  placeholder?: string;
  api?: string;
  saveName?: string;
  loadingClass?: string;
  loadingMoreClass?: string;
  defaultValue?: any;
  defaultValueKey?: string;
  inputClass?: string;
  noDataTitle?: string;
  spinnerInputClass?: string;
  suffixClass?: string;
  withIcon?: boolean;
  optionDefaultIcon?: string;
  optionIconClass?: string;
  defaultOptionIconClass?: string;
  wrapperClass?: string;
  getFromData?: boolean;
  optionWrapperClass?: string;
  error?: boolean;
  fromTop?: boolean;
  isAllOption?: boolean;
  notSelectedDefault?: boolean;
  visiblePlaceholder?: boolean;
  visiblePlaceholderText?: string;
}

const { t } = useI18n();

const props = withDefaults(defineProps<Props>(), {
  labelKey: "label",
  valueKey: "value",
  iconKey: "icon",
  disabled: false,
  placeholder: "",
  noDataTitle: "No results found :(",
  inputClass: "placeholder:!text-dark placeholder:text-sm w-full",
  withIcon: false,
  getFromData: false,
  error: false,
  fromTop: false,
  isAllOption: false,
  notSelectedDefault: false,
  visiblePlaceholder: false,
});

const $emit = defineEmits<{
  (event: "update:modelValue", value: string | number): void;
}>();

const selectedOptionRef = ref<Option | null>(null);
const options = ref<Option[]>([]);
const originalOptions = ref<Option[]>([]);
const storageOptions = computed(() =>
  sessionStorage.getItem(props.saveName || "")
);

const showOptions = ref(false);
const loading = ref(false);
const loadingMore = ref(false);

let paginationData = reactive<PaginationData>({
  offset: 0,
  limit: 10,
  total: 0,
  next: "",
});

let searchPaginationData = reactive<PaginationData>({
  offset: 0,
  limit: 10,
  total: 0,
  next: "",
});

const search = ref("");
const input = reactive<{
  placeholder: string;
}>({
  placeholder: selectedOptionRef.value?.[props.labelKey] || props.placeholder,
});

const select = ref();

onClickOutside(select, (event) => {
  const isClickInside = select?.value?.contains?.(event.target as Node);

  // Prevent closing if the click is inside the dropdown
  if (isClickInside) return;

  showOptions.value = false;
});

// watch(showOptions, (isOpen) => {
//   if (isOpen) {
//     document.body.style.overflow = "hidden"; // Disable scrolling
//   } else {
//     document.body.style.overflow = ""; // Re-enable scrolling
//   }
// });

const hasModelValue = computed(
  () => Boolean(props.modelValue) && props.modelValue !== "all"
);

function handleFocus() {
  if (!storageOptions.value?.length && !options.value?.length) {
    fetchOptions(true);
  }
  showOptions.value = true;
}

function handleBlur() {
  search.value = "";

  if (props.saveName && storageOptions.value?.length) {
    options.value = JSON.parse(storageOptions.value);
  }

  showOptions.value = false;

  const sessionData = sessionStorage.getItem(props.saveName || "");
  if (sessionData) {
    const parsedSessionOptions = JSON.parse(sessionData);
    if (
      Array.isArray(parsedSessionOptions) &&
      parsedSessionOptions?.length > 0
    ) {
      options.value = parsedSessionOptions;
    }
  } else if (!options.value?.length) {
    fetchOptions(true);
  } else {
    options.value = originalOptions.value;
  }
}

function searchOption() {
  if (search.value.trim().toLowerCase() !== "") {
    debounce(
      "search-select",
      () => {
        searchPaginationData.offset = 0;
        searchPaginationData.next = null;
        fetchOptions(true);
      },
      300
    );
  } else if (
    props.saveName &&
    JSON.parse(sessionStorage.getItem(props.saveName || ""))?.length
  ) {
    options.value = JSON.parse(sessionStorage.getItem(props.saveName || ""));
  } else if (originalOptions.value?.length && !props.saveName) {
    options.value = originalOptions.value;
  } else {
    fetchOptions(true);
  }
}

const clearSelect = (e: any) => {
  e.stopPropagation();
  $emit("update:modelValue", undefined);
  showOptions.value = false;
  selectedOptionRef.value = undefined;
  search.value = "";
};

function selectOption(option: Option) {
  if (option[props.valueKey] === props.modelValue) {
    return;
  }

  selectedOptionRef.value = option;

  $emit("update:modelValue", option[props.valueKey]);
  // input.placeholder = option[props.labelKey];
  showOptions.value = false;
  search.value = "";
}

if (storageOptions.value?.length) {
  options.value = JSON.parse(storageOptions.value);

  const storedPaginationData = sessionStorage.getItem(
    `${props.saveName}-pagination`
  );

  if (storedPaginationData) {
    paginationData = JSON.parse(storedPaginationData);
  }
}

function fetchOptions(force = false) {
  const pagination = search.value ? searchPaginationData : paginationData;

  loading.value = force;
  loadingMore.value = !force;
  if (force) {
    pagination.offset = 0;
  } else {
    pagination.offset += pagination.limit;
  }

  if (props.api) {
    return ApiService.query(props.api, {
      params: {
        search: search.value || undefined,
        limit: pagination.limit,
        offset: pagination.offset,
      },
    })
      .then((res: any) => {
        const resData = props.getFromData ? res?.data : res?.data?.results;

        pagination.next = res?.data?.next;
        const searchValueEmpty = search.value.trim() === "";

        if (force) {
          options.value = resData;
          if (!props.saveName && searchValueEmpty) {
            originalOptions.value = resData;
          }
        } else {
          options.value = [...(options.value || []), ...resData];
          if (!props.saveName && searchValueEmpty) {
            originalOptions.value = [
              ...(originalOptions.value || []),
              ...resData,
            ];
          }
        }

        if (props.saveName && !search.value.trim() && options.value) {
          sessionStorage.setItem(props.saveName, JSON.stringify(options.value));
          sessionStorage.setItem(
            `${props.saveName}-pagination`,
            JSON.stringify(paginationData)
          );
        }

        if (!search.value) {
          paginationData.total = res?.data?.total;
        }
      })
      .finally(() => {
        loading.value = false;
        loadingMore.value = false;
      });
  }
}

function onIntersectionObserver([entry]: IntersectionObserverEntry[]) {
  if (entry?.isIntersecting && props.api) {
    fetchOptions();
  }
}

function findOption(value: string | number): Option | undefined {
  return options.value.find(
    (option: Option) => option[props.valueKey] === value
  );
}

onMounted(async () => {
  if (props.defaultValueKey && props.modelValue !== "all") {
    await fetchOptions(true);
    selectedOptionRef.value = options.value.find(
      (item) => item.id === props.modelValue
    );
    const option = selectedOptionRef.value;
    if (option) {
      input.placeholder = option?.[props.labelKey] as string;
    }
    // else {
    //   ApiService.query(props.api, {
    //     query: {
    //       [props.defaultValueKey]: props.modelValue,
    //     },
    //   }).then(
    //     (res: { results: Option[]; next: string | null; total: number }) => {
    //       if (!props?.notSelectedDefault) {
    //         selectedOptionRef.value = res.data.results[0];
    //       }
    //     }
    //   );
    // }
  }
});

onBeforeUnmount(() => {
  if (props.saveName) {
    sessionStorage.removeItem(props.saveName);
    sessionStorage.removeItem(`${props.saveName}-pagination`);
  }
});
</script>

<style scoped>
.dots {
  width: 56px;
  height: 10px;
  background: radial-gradient(circle closest-side, #94a8aa 90%, #0000) 0% 50%,
    radial-gradient(circle closest-side, #94a8aa 90%, #0000) 50% 50%,
    radial-gradient(circle closest-side, #94a8aa 90%, #0000) 100% 50%;
  background-size: calc(100% / 1.6) 6px;
  background-repeat: no-repeat;
  animation: dots-7ar3yq 1s infinite linear;
}

@keyframes dots-7ar3yq {
  20% {
    background-position: 0% 0%, 50% 50%, 100% 50%;
  }

  40% {
    background-position: 0% 100%, 50% 0%, 100% 50%;
  }

  60% {
    background-position: 0% 50%, 50% 100%, 100% 0%;
  }

  80% {
    background-position: 0% 50%, 50% 50%, 100% 100%;
  }
}

.spinner-select {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 5px solid;
  border-color: #edf0f2;
  border-right-color: #c4c4c4;
  animation: spinner-d3wgkg 1s infinite linear;
}

@keyframes spinner-d3wgkg {
  to {
    transform: rotate(1turn);
  }
}

.spinner-input-suffix {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid;
  border-color: #edf0f2;
  border-right-color: #c4c4c4;
  animation: spinner-d3wgkg 1s infinite linear;
}

@keyframes spinner-d3wgkg {
  to {
    transform: rotate(1turn);
  }
}
</style>
