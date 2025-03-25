<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb :routes="routes" />
  </Teleport>
  <div>
    <section class="px-5 pt-5 bg-white rounded-2xl">
      <CTableWrapper
        nodata-title="no_students"
        nodata-subtitle="no_students_subtitle"
        :head="headData"
        :data="data"
        :items-per-page="pagination.page_size"
        :limit="pagination.page_size"
        :total="count"
        :loading="loading"
        :current-page="pagination.page"
        :title="t('students')"
        :subtitle="t('student_plural', { count: count })"
        @items-per-page="handleLimitChange"
        @page-change="handlePageChange"
        @search="handleSearch"
      >
        <template #beforeSearch>
          <div class="flex-y-center gap-5">
            <FSelect
              :options="groupCourses"
              v-model="course"
              selected-option-styles="bg-white !border-gray-800 rounded-md"
              value-key="id"
              label-key="title"
              class="min-w-[160px]"
              @change="handleCourseChange"
              :placeholder="$t('all_courses')"
            />
            <FSelect
              :options="groupOptions"
              v-model="group"
              selected-option-styles="bg-white !border-gray-800 rounded-md"
              value-key="id"
              label-key="title"
              class="min-w-[160px]"
              :placeholder="$t('all_groups')"
            />
            <FSelect
              :options="mentors"
              v-model="mentor"
              selected-option-styles="bg-white !border-gray-800 rounded-md"
              value-key="id"
              label-key="full_name"
              class="min-w-[160px]"
              :placeholder="$t('all_group_leads')"
            />
          </div>
        </template>
        <template #afterSearch>
          <CButton
            v-if="grandAccess(userRole ?? '')"
            class="h-10 flex items-center justify-center whitespace-nowrap !px-3 !py-2"
            icon="icon-add"
            icon-position="left"
            :text="t('add_student')"
            @click="openModal"
          />
        </template>
        <template #_index="{ row: data }">
          <span
            class="text-sm text-dark-100 font-semibold leading-normal"
            v-text="data._index + '.'"
          />
        </template>
        <template #user="{ row: data }">
          <CStudentCard
            :card="{
              name: data?.full_name || data?.title,
              image: data?.avatar,
              id: data?.id,
              isBlocked: !data?.is_active,
              isOnline: data?.is_online,
            }"
            :slug="slug"
          />
        </template>
        <template #course_name="{ row: data }">
          <div
            v-for="(course, courseIndex) in data?.courses"
            :key="courseIndex"
          >
            <p v-if="data?.courses.length">{{ course }}</p>
          </div>
        </template>
        <template #group_name="{ row: data }">
          <div v-for="(group, groupIndex) in data.groups" :key="groupIndex">
            <p v-if="data.groups.length">{{ group }}</p>
          </div>
        </template>
        <template #teacher_name="{ row: data }">
          <template v-for="(mentor, index) in data.mentors" :key="index">
            <p v-if="data.mentors.length">{{ mentor.full_name }}</p>
          </template>
        </template>
        <template #phone="{ row: data }">
          <a
            :href="`tel:${data?.phone_number}`"
            class="transition-300 hover:text-blueDark"
            >{{ data?.phone_number }}</a
          >
        </template>
        <template #date_joined="{ row: data }">
          <p>
            {{ dayjs(data?.date_joined).locale("ru").format("D MMMM, YYYY") }}
          </p>
        </template>
        <template #action="{ row: data }">
          <CDropdown>
            <template #head>
              <div
                class="h-7 w-7 nr-5 flex items-center justify-center gap-2.5 rounded-md bg-gray-100 group hover:bg-gray-800 focus:bg-gray-800 cursor-pointer"
              >
                <i
                  class="icon icon-more text-dark-100 group-hover:text-blueDark"
                ></i>
              </div>
            </template>
            <template #default>
              <div class="flex flex-col bg-white rounded-lg shadow-dropdown">
                <div
                  v-if="data.is_active"
                  class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300"
                  @click="
                    () => {
                      showBlock = true;
                      selectedStudent = data;
                    }
                  "
                >
                  <i class="icon-lock text-red text-xl"></i>
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                    >{{ $t("table.dropdown.lock") }}</span
                  >
                </div>
                <div
                  v-else
                  class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300"
                  @click="
                    () => {
                      showBlock = true;
                      selectedStudent = data;
                    }
                  "
                >
                  <i class="icon-unlock text-orange-400 text-xl" />
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                    >{{ $t("table.dropdown.unlock") }}</span
                  >
                </div>
                <hr class="w-full h-[1px] bg-gray-300" />
                <div
                  class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300"
                  @click="
                    () => {
                      showDelete = true;
                      selectedStudentId = data?.id;
                    }
                  "
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
      </CTableWrapper>
    </section>
    <CAddStudent
      :visible="visible"
      @close="visible = false"
      @submit="fetchStudents()"
    />
    <CDeleteDialog
      :title="$t('delete_student')"
      :subtitle="$t('delete_student_text')"
      @close="showDelete = false"
      :show="showDelete"
      @submit="deleteStudent"
    />
    <CDeleteDialog
      :title="
        selectedStudent?.is_active ? $t('block_student') : $t('unlock_student')
      "
      :subtitle="
        selectedStudent?.is_active
          ? $t('block_student_text')
          : $t('unlock_student_text')
      "
      @close="showBlock = false"
      :show="showBlock"
      :color="
        selectedStudent?.is_active
          ? '!text-red bg-red-100'
          : '!text-orange-400 bg-orange-100'
      "
      :submitText="
        selectedStudent?.is_active
          ? $t('table.dropdown.lock')
          : $t('table.dropdown.unlock')
      "
      :icon="selectedStudent?.is_active ? 'icon-lock' : 'icon-unlock'"
      :variant="selectedStudent?.is_active ? 'error' : 'warning-yellow'"
      @submit="blockAndUnlockStudent"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import CStudentCard from "@/modules/Students/components/CStudentCard.vue";
import { debounce } from "@/utils";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useStudentsStore } from "@/modules/Students/store";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";
import { useCustomToast } from "@/composables/useCustomToast";
import { IStudent } from "@/modules/Students/types";
import FSelect from "@/components/Form/Select/FSelect.vue";
import ApiService from "@/services/ApiService";
import CButton from "@/components/Common/CButton.vue";
import { useAuthStore } from "@/modules/Auth/stores";
import CAddStudent from "@/modules/Students/components/CAddStudent.vue";

const { t } = useI18n();
const { mounted } = useMounted();
const { showToast } = useCustomToast();
const store = useStudentsStore();
const showDelete = ref(false);
const showBlock = ref(false);
const selectedStudentId = ref("");
const selectedStudent = ref<IStudent>();

const course = ref("");
const group = ref("");
const mentor = ref("");

const data = computed(() => store.students);
const count = computed(() => store.count);
const loading = computed(() => store.loading);
const visible = ref(false);
const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("students"),
    route: "/students",
  },
]);

const headData = computed(() => [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "table.head.title2",
    key: "user",
  },
  {
    title: "table.head.title8",
    key: "course_name",
  },
  {
    title: "table.head.title9",
    key: "group_name",
  },
  {
    title: "table.head.title10",
    key: "teacher_name",
  },
  {
    title: "table.head.title6",
    key: "date_joined",
  },
  {
    title: "table.head.title7",
    key: "action",
  },
]);

const pagination = reactive({
  page: 1,
  page_size: 10,
});
const search = ref("");
const selectedFilter = ref("students");

const slug = computed(() =>
  selectedFilter.value === "students" ? "StudentsSingleCourses" : ""
);

const authStore = useAuthStore();

const userRole = computed(() => authStore?.user?.role);

const openModal = () => (visible.value = true);

function handlePageChange(page: number) {
  pagination.page = page;
  fetchStudents();
}

function handleLimitChange(limit: number) {
  pagination.page_size = limit;
  pagination.page = 1;
  fetchStudents();
}

function handleSearch(value: string) {
  search.value = value;
  pagination.page = 1;
  debounce("search", () => {
    fetchStudents();
  });
}

function fetchStudents() {
  store.fetchStudents({
    ...pagination,
    search: search.value || undefined,
    groups_members__flow__course: course.value || undefined,
    groups_members__group: group.value || undefined,
    groups_members__group__leads__lead: mentor.value || undefined,
  });
}

const deleteStudent = () => {
  showDelete.value = false;
  store
    .deleteStudent(selectedStudentId.value)
    .then(() => {
      showToast(t("student_deleted_successfully"), "success");
      fetchStudents();
    })
    .catch(() => {
      showToast(t("student_delete_error"), "error");
    });
};

function grandAccess(role: string) {
  return ["admin", "manager"]?.includes(role);
}

const blockAndUnlockStudent = () => {
  showBlock.value = false;
  store
    .updateStudent(selectedStudent.value)
    .then(() => {
      showToast(t("student_updated_successfully"), "success");
      fetchStudents();
    })
    .catch(() => {
      showToast(t("student_update_error"), "error");
    });
};

store.fetchStudents({
  ...pagination,
  search: search.value || undefined,
  groups_members__flow__course: course.value || undefined,
  groups_members__group: group.value || undefined,
  groups_members__group__leads__lead: mentor.value || undefined,
});

const groupCourses = ref([
  {
    id: "",
    title: t("all_courses"),
  },
]);

const groupOptions = ref([
  {
    id: "",
    title: t("all_groups"),
  },
]);

const mentors = ref([
  {
    id: "",
    full_name: t("all_group_leads"),
  },
]);

function GetCourses() {
  ApiService.get("backoffice/CoursesList").then((res: any) => {
    groupCourses.value = [
      {
        id: "",
        title: t("all_courses"),
      },
      ...res.data.results,
    ];
  });
}

function getGroups(id: number) {
  ApiService.query("backoffice/GroupsList", {
    params: {
      flow__course: id,
      limit: 200,
    },
  }).then((res: any) => {
    groupOptions.value = [
      {
        id: "",
        title: t("all_groups"),
      },
      ...res.data.results,
    ];
  });
}

function getMentors(id: number) {
  ApiService.query("backoffice/GroupLeadsList", {
    params: {
      group_leads__group: id,
      limit: 200,
    },
  }).then((res: any) => {
    mentors.value = [
      {
        id: "",
        full_name: t("all_group_leads"),
      },
      ...res.data.results,
    ];
  });
}

GetCourses();

watch(
  () => course.value,
  () => {
    groupOptions.value = [
      {
        id: "",
        title: t("all_groups"),
      },
    ];

    mentors.value = [
      {
        id: "",
        full_name: t("all_group_leads"),
      },
    ];
    group.value = "";
    getGroups(course.value);
    fetchStudents();
  }
);

watch(
  () => group.value,
  () => {
    mentors.value = [
      {
        id: "",
        full_name: t("all_group_leads"),
      },
    ];
    mentor.value = "";
    getMentors(group.value);
    fetchStudents();
  }
);

watch(
  () => mentor.value,
  () => {
    fetchStudents();
  }
);
</script>

<style scoped>
/* Add your scoped styles here */
</style>
