<template>
  <CCard class="w-full p-5">
    <p class="text-xl leading-130 font-semibold text-dark-100">
      {{ $t("general_information_about_group") }}
    </p>
    <FGroup class="my-5" :label="$t('name_group')">
      <FInput
        :placeholder="$t('think_about_group_name')"
        v-model="values.name"
        :error="$v.name.$error"
      />
    </FGroup>
    <FSelect :options="workers" selected-option-styles="!p-0">
      <template #selectedOption>
        <FInput
          :placeholder="$t('add_personal')"
          input-class="!font-medium"
          v-model="search"
        >
          <template #prefix>
            <i class="icon-search-normal text-gray-50 text-xl mr-3" />
          </template>
        </FInput>
      </template>
      <template #option="data">
        <div class="flex-center-between px-3 py-2 border-b border-gray-800">
          <div class="flex-y-center gap-3">
            <CAvatar class="!w-9 !h-9" :image="data?.option?.avatar" />
            <div>
              <p class="text-sm leading-130 font-medium text-dark-100">
                {{ data?.option?.full_name }}
              </p>
              <p class="mt-1 text-sm leading-130 font-normal text-gray">
                {{ $t(data?.option?.role) }}
              </p>
            </div>
          </div>
          <CButton
            class="h-9 flex-center"
            :text="$t('add')"
            @click="addWorker(data.option)"
          />
        </div>
      </template>
    </FSelect>

    <div class="flex flex-col gap-2 mt-5">
      <CPreviewUserCard
        v-for="(option, index) in values.selectedLeads"
        :key="index"
        v-bind="{ option }"
        @remove="values.selectedLeads.splice(index, 1)"
      />
    </div>

    <div class="mt-10 flex-center-between">
      <CButton
        class="min-w-[190px]"
        variant="info"
        :text="$t('cancel')"
        @click="$emit('back')"
      />
      <CButton
        class="min-w-[190px]"
        icon="icon-arrow-right"
        :text="$t('next_continue')"
        :disabled="!values.selectedLeads?.length"
        @click="onSubmit"
      />
    </div>
  </CCard>
</template>

<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import { TForm } from "@/composables/useForm";
import { unref, computed, ref, watch } from "vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import CAvatar from "@/components/CAvatar.vue";
import CButton from "@/components/Common/CButton.vue";
import CPreviewUserCard from "@/modules/Courses/components/Groups/Create/CPreviewUserCard.vue";
import { useCoursesStore } from "@/modules/Courses/store";
import { IWorker } from "@/modules/Courses/types";
import { debounce } from "@/utils";

const store = useCoursesStore();

const workers = computed(() => store.workers);
interface Props {
  form: TForm<any>;
}

const props = defineProps<Props>();
const emit = defineEmits(["next"]);

const { form } = unref(props);
const { values, $v } = form;

const search = ref("");

watch(
  () => search.value,
  (value) => {
    debounce("worker_search", () => {
      store.fetchWorkers(value);
    });
  }
);
const addWorker = (worker: IWorker) => {
  if (search.value) search.value = "";

  if (values.selectedLeads.includes(worker)) return;

  values.selectedLeads.push(worker);
};
const onSubmit = () => {
  $v.value.$touch();
  if ($v.value.$invalid) return;

  emit("next");
};
store.fetchWorkers(search.value);
</script>
