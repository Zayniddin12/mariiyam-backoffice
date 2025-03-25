<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <CCard class="p-5">
    <CTableWrapper
      :head="headData"
      :data="tableData"
      :limit="paginationData.defaultLimit"
      :current-page="paginationData.currentPage"
      :total="paginationData.total"
      :loading="loading"
      :items-per-page="paginationData.defaultLimit"
      :nodata-subtitle="t('no_books_text')"
      td-class="justify-center"
      :title="$t('books')"
      :subtitle="$t('books_count', { count: paginationData.total })"
      @page-change="onPageChange($event)"
      @items-per-page="onChangeLimit($event)"
      @search="onSearch($event)"
      :nodata-title="t('no_books')"
    >
      <template #afterSearch>
        <CButton
          :text="$t('add_book')"
          icon="icon-add"
          icon-position="left"
          @click="router.push('/books/create')"
        />
      </template>
      <template #name="{ row: data }">
        <div class="flex gap-x-3">
          <div
            class="size-10 rounded-lg overflow-hidden border border-gray-360"
          >
            <img :src="data?.main_image" />
          </div>
          <div>
            <RouterLink :to="`/books/${data?.id}`">
              <p
                class="text-dark-400 hover:text-blueDark transition-300 text-sm font-medium"
              >
                {{ data?.title }}
              </p>
            </RouterLink>
            <p class="text-gray-450 text-xs">{{ data?.author }}</p>
          </div>
        </div>
      </template>
      <template #book_price="{ row: data }">
        <p class="text-dark-400 text-xs">
          {{ formatMoneyDecimal(data?.price) + " " + "UZS" }}
        </p>
      </template>
      <template #sale="{ row: data }">
        <p class="text-dark-400 text-xs">{{ data?.discount ?? $t("no") }}</p>
      </template>
      <template #course_students="{ row: data }">
        <div class="flex gap-x-1 items-center">
          <i class="icon-people text-gray-460 text-xl" />
          <p class="text-dark-400 text-xs">
            {{ data?.students_who_bought_book }}
          </p>
        </div>
      </template>
      <template #created_at="{ row: data }">
        <p>{{ dayjs(data?.created_at).format("DD MMMM YYYY") }}</p>
      </template>
      <template #actions="{ row: data }">
        <CDropdown>
          <template #head>
            <div
              class="h-7 w-7 flex items-center justify-center gap-2.5 rounded-md bg-gray-360 group hover:bg-green-100 focus:bg-green-100 cursor-pointer transition-300"
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
                @click="router.push(`/books/${data?.id}/edit`)"
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
                  selectedBook = data?.id;
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
    :title="$t('delete_book')"
    :subtitle="$t('delete_book_text')"
    :loading="deleteLoading"
    @submit="onDeleteBook(selectedBook)"
    @close="showDelete = false"
  />
</template>
<script setup lang="ts">
import { useTableFetch } from "@/composables/useTableFetch";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import { formatMoneyDecimal } from "@/utils";
import dayjs from "dayjs";
import CDropdown from "@/components/Common/CDropdown.vue";
import CCard from "@/components/Card/CCard.vue";
import CButton from "@/components/Common/CButton.vue";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";
import { computed, ref } from "vue";
import ApiService from "@/services/ApiService";
import { useRouter } from "vue-router";
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useMounted } from "@/composables/useMounted";
import { useI18n } from "vue-i18n";

const {
  tableData,
  paginationData,
  onPageChange,
  onSearch,
  onChangeLimit,
  loading,
  fetchTableData,
} = useTableFetch("/backoffice/Books/");

const { t } = useI18n();
const { mounted } = useMounted();
const showDelete = ref(false);
const deleteLoading = ref(false);
const selectedBook = ref(0);
const router = useRouter();

function onDeleteBook(id: number) {
  deleteLoading.value = true;
  ApiService.post("/backoffice/DeleteBook/", {
    book: id,
  })
    .then(() => {
      showDelete.value = false;
      fetchTableData();
    })
    .finally(() => (deleteLoading.value = false));
}

const headData = [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "name",
    key: "name",
  },
  {
    title: "pages_count",
    key: "pages",
  },
  {
    title: "book_price",
    key: "book_price",
  },
  {
    title: "sale",
    key: "sale",
  },
  {
    title: "course_students",
    key: "course_students",
  },
  {
    title: "created_at",
    key: "created_at",
  },
  {
    title: "actions",
    key: "actions",
  },
];

const routes = computed(() => [
  {
    name: t("books"),
    route: "/",
  },
]);
</script>
