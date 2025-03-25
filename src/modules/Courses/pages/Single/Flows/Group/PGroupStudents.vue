<template>
  <Teleport v-if="mounted" to="#group-actions">
    <FSelectCustom
      :placeholder="$t('payment')"
      v-model="filter.status"
      :options="options"
      label-key="label"
      value-key="value"
      class="min-w-[220px]"
    />
    <FInput
      v-model="filter.search"
      prefix-class="pr-2.5"
      :placeholder="$t('search')"
      class="border border-gray-100 min-w-[240px]"
    >
      <template #prefix>
        <span class="icon-search-normal text-gray text-xl"></span>
      </template>
      <template #suffix>
        <button
          :class="{ '!opacity-100 !visible': filter.search?.length }"
          class="w-5 h-5 flex-center bg-gray/[16%] rounded-full p-1 transition-200 group hover:bg-red opacity-0 invisible"
          @click="filter.search = ''"
        >
          <span
            class="icon-close text-gray text-[10px] transition-200 group-hover:text-white"
          />
        </button>
      </template>
    </FInput>
    <CButton
      class="min-w-[220px]"
      icon-position="left"
      icon="icon-add"
      :text="$t('add_student')"
      @click="openDialog"
    />
  </Teleport>
  <div class="w-full">
    <CTableWrapper
      no-header
      :head="headData"
      :data="tableData"
      :items-per-page="paginationData?.defaultLimit"
      :limit="paginationData?.defaultLimit"
      :total="paginationData?.total"
      :current-page="paginationData?.currentPage"
      @itemsPerPage="onChangeLimit"
      @pageChange="onPageChange"
      v-bind="{ loading }"
    >
      <template #_index="{ row: data }">
        <p class="font-semibold">{{ data?._index }}.</p>
      </template>
      <template #student="{ row: data }">
        <CUserCardCopy
          :card="{
            name: data?.full_name,
            image: data?.avatar,
            isBlocked: !data?.is_active,
            isOnline: data?.is_online,
            id: data?.student_id,
          }"
        />
      </template>
      <template #total_point="{ row: data }">
        <p class="text-xs leading-130 font-normal text-gray">
          <span class="text-dark-100 font-medium">{{
            data?.overall_ball
          }}</span>
          / {{ data?.max_ball }}
        </p>
      </template>
      <template #payment="{ row: data }">
        <CCoursePaymentStatus :is-paid="data?.paid" />
      </template>
      <template #actions="{ row: data }">
        <CDropdown>
          <template #head>
            <div
              class="h-7 w-7 nr-5 flex items-center justify-center gap-2.5 rounded-md bg-gray-100 group hover:bg-gray-800 focus:bg-gray-800 cursor-pointer transition-300"
            >
              <i
                class="icon icon-more text-dark-100 group-hover:text-blueDark"
              ></i>
            </div>
          </template>

          <template #default>
            <div class="flex flex-col bg-white rounded-lg shadow-dropdown">
              <!--              <div-->
              <!--                class="min-w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300 transition-300"-->
              <!--              >-->
              <!--                <i class="icon-lock text-red text-xl"></i>-->
              <!--                <span-->
              <!--                  class="text-sm font-medium text-dark-100 leading-normal"-->
              <!--                  >{{ $t("student_profile.block") }}</span-->
              <!--                >-->
              <!--              </div>-->
              <hr class="w-full h-[1px] bg-gray-300" />
              <div
                class="min-w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300 transition-300"
                @click="showExcluded(data)"
              >
                <i class="icon-trash text-gray text-xl"></i>
                <span
                  class="text-sm font-medium text-dark-100 leading-normal"
                  >{{ $t("table.dropdown.delete") }}</span
                >
              </div>
            </div>
          </template>
        </CDropdown>
      </template>

      <!--   Actions   -->
      <template #no-data>
        <div class="py-[128px] flex-center">
          <div class="text-center">
            <img
              src="/images/svg/no-data/no-groups.svg"
              alt="no-events"
              class="mx-auto"
            />
            <p class="text-base leading-130 font-semibold text-dark-100 mt-6">
              {{ $t("no_groups_yet") }}
            </p>
            <p class="mt-1.5 text-sm leading-130 font-normal text-gray">
              {{ $t("no_groups_yet_text") }}
            </p>
          </div>
        </div>
      </template>
    </CTableWrapper>
  </div>
  <CDeleteDialog
    :show="showExcludedDialog"
    :title="$t('excluded_student')"
    :subtitle="$t('excluded_student_text')"
    icon="icon-trash"
    color="!text-yellow bg-[#FEF5E6]"
    variant="warning-yellow"
    submit-text="table.dropdown.delete"
    :loading="buttonLoading"
    @close="showExcludedDialog = false"
    @submit="excludeStudent"
  />
  <CDialog :show="showModal" :title="$t('add_student')" @close="closeDialog">
    <div class="p-6">
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
      <div class="min-h-[300px]">
        <div class="flex flex-col gap-2 mt-5">
          <CPreviewUserCard
            noRole
            v-for="(option, index) in students"
            :key="index"
            v-bind="{ option }"
            @remove="students.splice(index, 1)"
          />
        </div>
        <CGroupNoData
          v-if="!students?.length"
          :title="$t('no_students_list')"
          :text="$t('no_students_list_text')"
        />
      </div>
      <div class="flex items-center gap-4 mt-6">
        <CButton
          class="w-full"
          :text="$t('cancel')"
          @click="closeDialog"
          variant="secondary"
        />
        <CButton
          class="w-full"
          :text="$t('add')"
          :disabled="!students.length"
          @click="groupMemberCreate"
          :loading="memberCreateLoading"
        />
      </div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CCoursePaymentStatus from "@/modules/Students/components/CCoursePaymentStatus.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { useRoute } from "vue-router";
import { useMounted } from "@/composables/useMounted";
import FInput from "@/components/Form/Input/FInput.vue";
import { reactive, ref, watch } from "vue";
import { debounce, updateQueryParams } from "@/utils";
import FSelectCustom from "@/components/Form/Select/FSelectCustom.vue";
import { useI18n } from "vue-i18n";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";
import ApiService from "@/services/ApiService";
import CButton from "@/components/Common/CButton.vue";
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import apiService from "@/services/ApiService";
import { useCustomToast } from "@/composables/useCustomToast";
import CPreviewUserCard from "@/modules/Courses/components/Groups/Create/CPreviewUserCard.vue";
import CUserCardCopy from "@/components/Card/CUserCardCopy.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import CAvatar from "@/components/CAvatar.vue";
import CGroupNoData from "@/modules/Courses/components/Groups/Create/CGroupNoData.vue";
import { IStudent } from "@/modules/Students/types";
type StudentIdFullNamePhone = Pick<
  IStudent,
  "id" | "full_name" | "phone_number"
>;

const { mounted } = useMounted();

const { showToast } = useCustomToast();
const route = useRoute();
const { t } = useI18n();

const buttonLoading = ref(false);
const showExcludedDialog = ref(false);
const selectedStudent = ref(null);
const showModal = ref(false);
const memberCreateLoading = ref(false);
const responseError = ref(false);
const studentUrl = ref("");
const students = ref([]);
const searchedUsers = ref<StudentIdFullNamePhone[]>([]);
const search = ref("");

const filter = reactive({
  search: route.query?.search || "",
  status: route.query?.paid || "all",
});

const {
  tableData,
  paginationData,
  onPageChange,
  onChangeLimit,
  onSearch,
  fetchTableData,
  loading,
} = useTableFetch(`backoffice/GroupStudents/${route.params.groupId}/`);

function showExcluded(data: any) {
  selectedStudent.value = data;
  showExcludedDialog.value = true;
}

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

function excludeStudent() {
  buttonLoading.value = true;
  ApiService.delete(
    `backoffice/GroupMemberDelete/${selectedStudent.value?.id}/`
  )
    .then(() => {
      showExcludedDialog.value = false;
      fetchTableData();
    })
    .finally(() => (buttonLoading.value = false));
}
function closeDialog() {
  showModal.value = false;
  studentUrl.value = "";
  responseError.value = false;
  students.value = [];
}
function openDialog() {
  showModal.value = true;
}
function groupMemberCreate() {
  memberCreateLoading.value = true;
  ApiService.post(`backoffice/GroupMemberCreate/`, {
    group: Number(route.params?.groupId),
    students_ids: students.value.map((student) => student?.id),
  })
    .then(() => {
      fetchTableData();
      closeDialog();
    })
    .catch((err) => {
      showToast(err?.response?.data?.[0]?.error?.message, "error");
    })
    .finally(() => (memberCreateLoading.value = false));
}
// async function getStudents() {
//   if (!studentUrl.value) {
//     responseError.value = true;
//     return;
//   }
//
//   try {
//     studentAddLoading.value = true;
//     const response = await apiService.post("backoffice/CRMStudents/", {
//       flow: route.params?.flowId,
//       student_ids: studentUrl.value,
//     });
//     response.data?.forEach((element) => {
//       if (!element?.is_flow_member) {
//         students.value.push(element?.student);
//       } else {
//         showToast(
//           element?.student?.full_name + " " + t("already_in_flow"),
//           "error"
//         );
//       }
//     });
//     responseError.value = false;
//   } catch (err) {
//     responseError.value = true;
//     showToast(err?.response?.data?.[0]?.error?.message, "error");
//   } finally {
//     studentAddLoading.value = false;
//     studentUrl.value = "";
//   }
// }

const addStudent = (student: StudentIdFullNamePhone) => {
  if (students.value.includes(student)) return;
  students.value.push(student);
};

watch(
  () => filter.search,
  () => onSearch(filter.search)
);

watch(
  () => filter.status,
  async () => {
    if (filter.status === "all") {
      await updateQueryParams("paid", undefined);
    } else {
      await updateQueryParams("paid", filter.status);
    }
    await fetchTableData();
  }
);
watch(
  () => studentUrl.value,
  () => {
    if (studentUrl.value) {
      responseError.value = false;
    }
  }
);
const options = [
  {
    label: t("all"),
    value: "all",
  },
  {
    label: t("succeed"),
    value: "true",
  },
  {
    label: t("no_succeed"),
    value: "false",
  },
];

const headData = [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "student",
    key: "student",
  },
  {
    title: "point_by_lesson",
    key: "lessons_ball",
  },
  {
    title: "point_by_task",
    key: "assignments_ball",
  },
  {
    title: "total_point",
    key: "total_point",
  },
  {
    title: "payment",
    key: "payment",
  },
  {
    title: "actions",
    key: "actions",
  },
];
</script>
