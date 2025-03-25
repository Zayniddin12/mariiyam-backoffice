<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <CCard class="p-5">
    <CTableWrapper
      :nodata-title="$t('no_categories')"
      :nodata-subtitle="$t('no_categories_text')"
      :head="categoriesHeadData"
      :data="tableData"
      :limit="paginationData.defaultLimit"
      :current-page="paginationData.currentPage"
      :total="paginationData.total"
      :loading="loading"
      :items-per-page="paginationData.defaultLimit"
      :title="$t('categories')"
      :subtitle="$t('categories_count', { count: paginationData.total })"
      @page-change="onPageChange($event)"
      @items-per-page="onChangeLimit($event)"
      @search="onSearch($event)"
    >
      <template #afterSearch>
        <CButton
          :text="$t('create')"
          icon="icon-add"
          icon-position="left"
          @click="router.push('/categories/create')"
        />
      </template>
      <template #title="{ row: data }">
        <div class="flex gap-x-3 items-center">
          <div
            class="rounded-lg flex-shrink-0 size-10 overflow-hidden border border-gray-100"
          >
            <img
              :src="data?.photo ?? '/images/svg/no-data/no-groups.svg'"
              :alt="data?.title"
              class="object-center"
            />
          </div>
          <p
            class="text-sm text-dark-400 font-medium cursor-pointer hover:text-blueDark transition-300"
            @click="router.push(`/categories/${data?.id}`)"
          >
            {{ data?.title }}
          </p>
        </div>
      </template>
      <template #created_at="{ row: data }">
        <p class="text-xs text-dark-400">
          {{ dayjs(data?.created_at).format("DD MMMM, YYYY") }}
        </p>
      </template>
      <template #courses="{ row: data }">
        <p class="text-xs text-dark-400">{{ data?.courses_number }}</p>
      </template>
      <template #description="{ row: data }">
        <div v-html="data?.description" />
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
                @click="router.push(`/categories/${data?.id}/edit`)"
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
                  showDelete = true;
                  selectedCategory = data?.id;
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
</template>

<script setup lang="ts">
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useMounted } from "@/composables/useMounted";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { categoriesHeadData } from "@/modules/Students/data";
import dayjs from "dayjs";
import CDropdown from "@/components/Common/CDropdown.vue";
import CCard from "@/components/Card/CCard.vue";
import CButton from "@/components/Common/CButton.vue";
import { useRouter } from "vue-router";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";
import ApiService from "@/services/ApiService";
import { useCustomToast } from "@/composables/useCustomToast";

const { mounted } = useMounted();
const { t } = useI18n();
const router = useRouter();
const { showToast } = useCustomToast();

const showDelete = ref(false);
const deleteLoading = ref(false);
const selectedCategory = ref();

const routes = computed(() => [
  {
    name: t("categories"),
    route: "/categories",
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
} = useTableFetch("backoffice/CourseCategoryList/");

function deleteCategory(id: number) {
  deleteLoading.value = true;
  ApiService.post("/backoffice/CourseCategoryDelete/", { category: id })
    .then(() => {
      showDelete.value = false;
      fetchTableData();
    })
    .catch((err) => {
      console.log(err);
      showToast(err.message, "error");
    })
    .finally(() => (deleteLoading.value = false));
}
</script>
