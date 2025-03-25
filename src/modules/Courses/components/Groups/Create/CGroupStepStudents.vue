<template>
  <CCard class="w-full p-5">
    <p class="text-xl leading-130 font-semibold text-dark-100">
      {{ $t("students") }}
    </p>
    <p class="mt-1 text-xs leading-normal text-gray-700">
      {{ $t("added_students") }}
      <span class="text-gray">{{ values.students.length }}</span>
    </p>
    <div class="mt-5">
      <FSelect :options="searchedUsers" selected-option-styles="!p-0">
        <template #selectedOption>
          <FInput
            :placeholder="$t('add_student')"
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
                  {{ $t(data?.option?.phone_number) }}
                </p>
              </div>
            </div>
            <CButton
              class="h-9 flex-center"
              :text="$t('add')"
              @click="addStudent(data?.option)"
            />
          </div>
        </template>
      </FSelect>
    </div>

    <div>
      <div class="flex flex-col gap-2 mt-5">
        <CPreviewUserCard
          noRole
          v-for="(option, index) in values.students"
          :key="index"
          v-bind="{ option }"
          @remove="values.students.splice(index, 1)"
        />
      </div>
      <CGroupNoData
        v-if="!values.students?.length"
        :title="$t('no_students_list')"
        :text="$t('no_students_list_text')"
      />
    </div>

    <div class="mt-10 flex-center-between">
      <CButton
        class="min-w-[190px]"
        variant="info"
        :text="$t('back')"
        icon="icon-arrow-right rotate-180"
        icon-position="left"
        @click="$emit('back')"
      />
      <CButton
        class="min-w-[190px]"
        icon="icon-arrow-right"
        :text="$t('next_continue')"
        :disabled="!values.students?.length"
        @click="$emit('next')"
      />
    </div>
  </CCard>
</template>

<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import { TForm } from "@/composables/useForm";
import { unref, ref, watch } from "vue";
import CButton from "@/components/Common/CButton.vue";
import CGroupNoData from "@/modules/Courses/components/Groups/Create/CGroupNoData.vue";
import CPreviewUserCard from "@/modules/Courses/components/Groups/Create/CPreviewUserCard.vue";
import apiService from "@/services/ApiService";
import { useCustomToast } from "@/composables/useCustomToast";
import { useI18n } from "vue-i18n";
import { debounce } from "@/utils";
import CAvatar from "@/components/CAvatar.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import { IStudent } from "@/modules/Students/types";
const { showToast } = useCustomToast();
interface Props {
  form: TForm<any>;
}

type StudentIdFullNamePhone = Pick<
  IStudent,
  "id" | "full_name" | "phone_number"
>;

const props = defineProps<Props>();

const { form } = unref(props);
const { t } = useI18n();
const { values, $v } = form;
const searchedUsers = ref<StudentIdFullNamePhone[]>([]);
const loading = ref(false);
const responseError = ref(false);
const search = ref("");

watch(
  () => search.value,
  (value) => {
    debounce("search_students", () => {
      getStudents(value);
    });
  }
);

getStudents("");

async function getStudents(value) {
  // $v.value.$touch();
  // if ($v.value.$error) return;
  try {
    loading.value = true;
    const response = await apiService.query(
      `study/users-ready-for-join-group`,
      {
        params: {
          search: value,
        },
      }
    );
    searchedUsers.value = [];
    response.data.results?.forEach((data) => {
      searchedUsers.value.push(data?.user);
      // values.students.push(data?.user);
    });
  } catch (err) {
    responseError.value = true;
    showToast(err?.response?.data?.[0]?.error?.message, "error");
  } finally {
    loading.value = false;
    // values.url = "";
    // $v.value.$reset();
  }
}

const addStudent = (student: StudentIdFullNamePhone) => {
  if (values.students.includes(student)) return;
  values.students.push(student);
};
</script>
