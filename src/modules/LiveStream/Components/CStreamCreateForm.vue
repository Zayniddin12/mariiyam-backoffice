<template>
  <div class="grid grid-cols-12 gap-6 mt-6">
    <div class="2xl:col-span-9 col-span-8">
      <CCard class="p-6">
        <form>
          <h3 class="text-dark-100 text-xl font-semibold">
            {{ $t("general_information") }}
          </h3>
          <FGroup :label="$t('youtube_link')" class="mt-4">
            <FInput
              :placeholder="$t('enter_title')"
              v-model="values.youtube_url"
              :error="form?.$v?.value?.youtube_url?.$error"
              @change="form?.$v?.value?.youtube_url?.$touch()"
              :maxlength="100"
            />
          </FGroup>
          <FGroup :label="$t('for_which_groups')" class="mt-4">
            <template #labelOpposite>
              <FToggle
                :model-value="form.values.toggle"
                label="Toggle"
                @change="toggleChange"
              />
            </template>
            <MultipleSelect
              labelKey="name"
              valueKey="id"
              :options="filteredOptions"
              :error="props.form?.$v?.value?.group?.$error"
              v-model="values.group"
              :disabled="form.values.toggle"
            >
              <template #selectedOption>
                <div class="flex-center-between w-full">
                  <div class="flex items-center w-full">
                    <div
                      class="flex-y-center gap-2.5 border border-transparent"
                    >
                      <div class="w-9 h-9 rounded-md flex-center">
                        <i class="icon-search-normal text-xl text-[#E3E8E9]" />
                      </div>
                    </div>
                    <input
                      :class="{ disabled: form.values.toggle }"
                      class="w-full bg-gray-100 outline-none text-[13px] font-medium !border-none"
                      :placeholder="placeholderText"
                      v-model="searchQuery"
                      @input="onSearchInput"
                      :disabled="form.values.toggle"
                    />
                  </div>
                  <i
                    class="icon-chevron-down text-xl text-gray-700 transition-300"
                  />
                </div>
              </template>
              <template #option="option">
                <div
                  class="flex items-center justify-between gap-2.5 p-2 pb-3 hover:bg-gray-800 transition-300"
                  @click="addSelectedOption(option?.option, $event)"
                >
                  <div>
                    <Highlighter
                      class="text-dark-100 text-sm text-start leading-130 font-medium transition-300 hover:!text-blueDark"
                      highlight-class-name="bg-[#FFCD55] rounded p-0.5"
                      :search-words="[searchQuery]"
                      :text-to-highlight="option?.option?.title"
                    />
                    <p class="text-gray text-sm leading-130 font-medium mt-1">
                      {{ option?.option?.student_count }}
                      {{ $t("course_students") }}
                    </p>
                  </div>
                  <FCheckbox
                    :checked="isChecked(option?.option?.id)"
                    @change="addSelectedOption(option?.option, $event)"
                  />
                </div>
              </template>
            </MultipleSelect>
            <div
              :class="{ 'hidden !mt-2': form.values.toggle }"
              class="flex items-center mt-2 flex-wrap gap-2"
            >
              <div
                class="bg-[#EDF1F5] flex items-center text-dark-100 font-medium leading-130 py-1.5 px-4 rounded-lg gap-1"
                v-for="(item, index) in selectedOptions"
                :key="index"
              >
                <h3>{{ item.title }}</h3>
                <button @click="removeSelectedOption(index)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      opacity="0.4"
                      d="M10.0003 18.3337C14.6027 18.3337 18.3337 14.6027 18.3337 10.0003C18.3337 5.39795 14.6027 1.66699 10.0003 1.66699C5.39795 1.66699 1.66699 5.39795 1.66699 10.0003C1.66699 14.6027 5.39795 18.3337 10.0003 18.3337Z"
                      fill="#8898AA"
                    />
                    <path
                      d="M10.8831 9.9998L12.7998 8.08314C13.0415 7.84147 13.0415 7.44147 12.7998 7.1998C12.5581 6.95814 12.1581 6.95814 11.9165 7.1998L9.9998 9.11647L8.08314 7.1998C7.84147 6.95814 7.44147 6.95814 7.1998 7.1998C6.95814 7.44147 6.95814 7.84147 7.1998 8.08314L9.11647 9.9998L7.1998 11.9165C6.95814 12.1581 6.95814 12.5581 7.1998 12.7998C7.3248 12.9248 7.48314 12.9831 7.64147 12.9831C7.7998 12.9831 7.95814 12.9248 8.08314 12.7998L9.9998 10.8831L11.9165 12.7998C12.0415 12.9248 12.1998 12.9831 12.3581 12.9831C12.5165 12.9831 12.6748 12.9248 12.7998 12.7998C13.0415 12.5581 13.0415 12.1581 12.7998 11.9165L10.8831 9.9998Z"
                      fill="#8898AA"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </FGroup>
        </form>
      </CCard>
      <CCard class="p-6 mt-5">
        <form>
          <h3 class="text-dark-100 text-xl font-semibold">
            {{ $t("description") }}
          </h3>
          <FGroup :label="$t('title')" class="mt-4">
            <FInput
              :placeholder="$t('enter_title')"
              v-model="values.title"
              :error="form?.$v?.value?.title?.$error"
              @change="form.$v.value.title?.$touch()"
              :maxlength="100"
            />
          </FGroup>
          <FGroup :label="$t('subtitle')" class="mt-4">
            <CRichText
              @editor="(val) => (values.description = val)"
              v-model="values.description"
              :error="form.$v.value.description.$error"
            />
          </FGroup>
        </form>
      </CCard>
    </div>
    <CCard class="2xl:col-span-3 col-span-4 p-5 h-fit">
      <h3 class="text-dark-100 text-sm mb-2">
        {{ $t("cover") }}
      </h3>
      <ImageUploader
        @change="values.cover = $event"
        :default-image="values?.cover"
        :error="form.$v.value.cover.$error"
        :key="loading"
      />
    </CCard>
  </div>
</template>

<script setup lang="ts">
import { ref, unref, watch, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import CCard from "@/components/Card/CCard.vue";
import ImageUploader from "@/components/Form/Uploader/ImageUploader.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import CRichText from "@/components/CRichText.vue";
import MultipleSelect from "@/components/Form/Select/MulitpleSelect.vue";
import FCheckbox from "@/components/Form/Checkbox/FCheckbox.vue";
import FToggle from "@/components/Form/FToggle.vue";
import { useStudentsStore } from "@/modules/Students/store";
import { TForm } from "@/composables/useForm";
import Highlighter from "vue-highlight-words";
import { useI18n } from "vue-i18n";
import { debounce } from "@/utils";

interface Props {
  form: TForm<any>;
  loading?: boolean;
}

const props = defineProps<Props>();
const router = useRouter();
const studentStore = useStudentsStore();
const { values } = unref(props.form);
const selectedOptionId = ref<number[]>([]);
const selectedOptions = ref<any[]>([]);
const selectOptions = ref<any[]>([]);
const searchQuery = ref<string>("");
const { t } = useI18n();

const fetchGroups = async () => {
  try {
    const response = await studentStore.fetchGroupsList({
      page: 1,
      search: searchQuery.value,
    });
    selectOptions.value = response.results;
    if (response.results.length > 0 && !searchQuery.value) {
      router.push({ name: "PError" });
    }
  } catch (error) {
    console.error("Failed to fetch groups", error);
  }
};

onMounted(() => {
  fetchGroups();
});

const toggleChange = () => {
  values.toggle = !values.toggle;
};

const addSelectedOption = (option: any) => {
  const index = selectedOptions.value.findIndex(
    (item) => item.id === option.id
  );
  if (index === -1) {
    selectedOptions.value.push(option);
    selectedOptionId.value.push(option.id);
  } else {
    selectedOptions.value.splice(index, 1);
    selectedOptionId.value.splice(index, 1);
  }
};

const removeSelectedOption = (index: number) => {
  selectedOptions.value.splice(index, 1);
  selectedOptionId.value.splice(index, 1);
};

const isChecked = (id: number) => {
  return selectedOptionId.value.includes(id);
};

const placeholderText = computed(() => {
  return values.toggle ? t("for_all_groups") : t("add_group_flow");
});

const filteredOptions = computed(() => {
  return selectOptions.value.filter((option) =>
    option.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const onSearchInput = debounce(
  "onSearchInput",
  () => {
    fetchGroups();
  },
  300
);

watch(
  () => values.toggle,
  (newValue) => {
    if (newValue) {
      selectedOptions.value = [...selectOptions.value];
      selectedOptionId.value = selectOptions.value.map((item) => item.id);
    } else {
      selectedOptions.value = [];
      selectedOptionId.value = [];
    }
  },
  { immediate: true }
);
</script>

<style>
.ck-content {
  height: 200px !important;
}
.disabled {
  cursor: not-allowed !important;
  opacity: 0.7 !important;
}
</style>
