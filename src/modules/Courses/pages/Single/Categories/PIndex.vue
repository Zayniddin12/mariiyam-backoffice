<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <CCommonHeader
    :title="category?.title"
    :image="category?.photo"
    no-tabs
    no-hr
  >
    <template #actions>
      <CButton
        variant="warning"
        :text="$t('table.dropdown.remove')"
        icon="icon-trash"
        icon-position="left"
        @click="
          showDelete = true;
          selectedCategory = route.params.categoryId;
        "
      />
      <CButton
        variant="info"
        :text="$t('table.dropdown.edit')"
        icon="icon-edit"
        icon-position="left"
        @click="router.push(`/categories/${route.params.categoryId}/edit`)"
      />
    </template>
    <template #details>
      <div class="flex flex-col gap-y-2">
        <p class="text-gray-460 text-xs">{{ $t("description") }}</p>
        <div v-html="category?.description" />
      </div>
    </template>
    <template #content>
      <div class="mt-6 ml-6 pb-6 w-fit flex gap-x-4">
        <CProfileDashDetail
          description="courses"
          :title="category?.course_number"
        />
        <CProfileDashDetail
          description="created_at"
          :title="dayjs(category?.created_at).format('DD MMMM YYYY')"
        />
      </div>
    </template>
  </CCommonHeader>
  <CCard class="p-5 mt-5">
    <template v-if="!category?.courses?.length && !loading">
      <p class="text-dark-400 text-base font-semibold">{{ $t("courses") }}</p>
      <p class="text-xs text-gray-460">
        {{ $t("courses_count", { count: 0 }) }}
      </p>
      <CNodata
        image="/images/svg/no-data/no-category.svg"
        :title="$t('nodata_courses')"
        :subtitle="$t('nodata_courses_text')"
        :button-text="$t('add_course')"
        @submit="router.push('/courses-create')"
      />
    </template>
    <template v-else>
      <CTableWrapper
        :nodata-title="$t('nodata_courses')"
        :nodata-subtitle="$t('nodata_courses_text')"
        :head="categoriesSingleHeadData"
        :title="$t('courses')"
        :subtitle="$t('courses_count', { count: paginationData.total })"
        :data="tableData"
        :limit="paginationData.defaultLimit"
        :current-page="paginationData.currentPage"
        :total="paginationData.total"
        :loading="loading"
        :items-per-page="paginationData.defaultLimit"
        @page-change="onPageChange($event)"
        @items-per-page="onChangeLimit($event)"
        @search="onSearch($event)"
      >
        <template #afterSearch>
          <CButton
            :text="$t('add_course')"
            icon="icon-add"
            icon-position="left"
            @click="router.push('/courses-create')"
          />
        </template>
        <template #name="{ row: data }">
          <div class="flex gap-x-3 items-center">
            <div
              class="rounded-lg size-10 overflow-hidden border border-gray-100 w-fit"
            >
              <img
                :src="data?.photo ?? '/images/svg/no-data/no-groups.svg'"
                :alt="data?.title"
                class="size-10"
              />
            </div>
            <p
              class="text-sm text-dark-400 font-medium cursor-pointer hover:text-blueDark transition-300"
              @click="router.push(`/courses/${data?.id}`)"
            >
              {{ data?.title }}
            </p>
          </div>
        </template>
        <template #created_at="{ row: data }">
          <p>{{ dayjs(data.created_at).format("DD MMMM, YYYY") }}</p>
        </template>
        <template #modules="{ row: data }">
          <p class="text-xs text-dark-400">{{ data?.modules_number }}</p>
        </template>
        <template #lessons="{ row: data }">
          <p class="text-xs text-dark-400">{{ data?.lessons_count }}</p>
        </template>
        <template #home_task="{ row: data }">
          <p class="text-xs text-dark-400">{{ data?.assignments_count }}</p>
        </template>
        <template #duration="{ row: data }">
          <p class="text-xs text-dark-400">
            {{ $t("days", { day: data?.total_duration }) }}
          </p>
        </template>
        <template #course_students="{ row: data }">
          <div class="flex items-center gap-x-1">
            <i class="icon-people text-xl text-gray-460" />
            <p class="text-xs text-dark-400">
              {{ formatMoneyDecimal(data?.students_count) }}
            </p>
          </div>
        </template>
        <template #actions="{ row: data }">
          <CDropdown>
            <template #head>
              <div
                class="h-7 w-7 nr-5 flex items-center justify-center gap-2.5 rounded-md bg-gray-360 group hover:bg-green-100 focus:bg-green-100 cursor-pointer transition-300"
              >
                <i
                  class="icon icon-more text-dark-100 group-hover:text-green transition-300"
                ></i>
              </div>
            </template>

            <template #default>
              <div class="flex flex-col bg-white rounded-lg shadow-dropdown">
                <div
                  class="min-w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300 transition-300"
                  @click="router.push(`/courses-edit/${data?.id}`)"
                >
                  <i class="icon-edit text-dark-400 text-xl"></i>
                  <span
                    class="text-sm font-medium text-dark-400 leading-normal"
                    >{{ $t("change") }}</span
                  >
                </div>
                <hr class="w-full h-[1px] bg-gray-300" />
                <div
                  class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-red-100 transition-300"
                  @click="
                    showDeleteCourse = true;
                    selectedCourse = data?.id;
                  "
                >
                  <i class="icon-trash text-red text-xl"></i>
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                    >{{ $t("table.dropdown.remove") }}</span
                  >
                </div>
              </div>
            </template>
          </CDropdown>
        </template>
      </CTableWrapper>
    </template>
  </CCard>
  <CDeleteDialog
    :show="showDelete"
    variant="warning"
    :title="$t('delete_category')"
    :subtitle="$t('delete_category_text')"
    :loading="deleteLoading"
    @submit="deleteCategory(selectedCategory)"
    @close="showDelete = false"
  />
  <CDeleteCourse
    :show="showDeleteCourse"
    :user-role="userRole"
    @close="showDeleteCourse = false"
    @submit="
      () => {
        courseStore.fetchCategorySingle(String(route.params.categoryId));
        fetchTableData();
      }
    "
    :id="selectedCourse"
  />
</template>

<script setup lang="ts">
import { useCoursesStore } from "@/modules/Courses/store.ts";
import { useRoute } from "vue-router";
import { useMounted } from "@/composables/useMounted";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import CButton from "@/components/Common/CButton.vue";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import CCard from "@/components/Card/CCard.vue";
import CNodata from "@/components/Common/CNodata.vue";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";
import ApiService from "@/services/ApiService";
import router from "@/router";
import { useCustomToast } from "@/composables/useCustomToast";
import { useTableFetch } from "@/composables/useTableFetch";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import { categoriesSingleHeadData } from "@/modules/Students/data.ts";
import { formatMoneyDecimal } from "@/utils";
import CDropdown from "@/components/Common/CDropdown.vue";
import CDeleteCourse from "@/modules/Courses/components/Delete/CDeleteCourse.vue";
import { useAuthStore } from "@/modules/Auth/stores";

const route = useRoute();
const { t } = useI18n();
const { mounted } = useMounted();
const { showToast } = useCustomToast();
const courseStore = useCoursesStore();
courseStore.fetchCategorySingle(String(route.params.categoryId));
const authStore = useAuthStore();

const userRole = computed(() => authStore?.user?.role);

const showDelete = ref(false);
const showDeleteCourse = ref(false);
const deleteLoading = ref(false);
const selectedCategory = ref();
const selectedCourse = ref(null);

const category = computed(() => courseStore.categorySingle);

const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("categories"),
    route: "/categories",
  },
  {
    name: category.value?.title,
    route: "/",
  },
]);

const {
  tableData,
  paginationData,
  onPageChange,
  onSearch,
  onChangeLimit,
  loading,
  fetchTableData,
} = useTableFetch(`backoffice/CategoryCourses/${route.params.categoryId}/`);

function deleteCategory(id: number) {
  deleteLoading.value = true;
  ApiService.post("/backoffice/CourseCategoryDelete/", { category: id })
    .then(() => {
      router.push("/categories");
      showDelete.value = false;
    })
    .catch((err) => {
      showToast(err.message, "error");
    })
    .finally(() => (deleteLoading.value = false));
}
</script>
