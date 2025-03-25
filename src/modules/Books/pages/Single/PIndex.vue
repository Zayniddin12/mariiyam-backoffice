<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <CCommonHeader
    :image="book?.main_image"
    :title="book?.title"
    :sub-title="book?.author"
    sub-title-class="!bg-transparent !text-gray-450 !p-0"
    :tab-list="tabs"
    :active="activeTab"
    @change-tab="activeTab = $event"
  >
    <template #actions>
      <CButton
        variant="warning"
        :text="$t('table.dropdown.remove')"
        icon="icon-trash"
        icon-position="left"
        @click="
          showDelete = true;
          selectedBook = route.params.id;
        "
      />
      <CButton
        variant="info"
        :text="$t('table.dropdown.edit')"
        icon="icon-edit"
        icon-position="left"
        @click="router.push(`/books/${route.params.id}/edit`)"
      />
    </template>
    <template #details>
      <CProfileDashDetail
        :title="book?.pages ?? '-'"
        :description="$t('pages')"
      />
      <CProfileDashDetail
        :title="dayjs(book?.created_at).format('DD MMMM YY') ?? '-'"
        :description="$t('created_at')"
      />
      <CProfileDashDetail
        :title="
          book?.price ? formatMoneyDecimal(book?.price) + ' ' + 'UZS' : '-'
        "
        :description="$t('book_price')"
      />
      <CProfileDashDetail
        :title="
          book?.discount?.percentage
            ? book?.discount?.percentage + '%'
            : $t('no')
        "
        :description="$t('discount')"
      />
      <CProfileDashDetail
        wrapper-class="bg-green-100 !border-green"
        :title="book?.students_who_bought_book ?? '0'"
        :description="$t('course_students')"
      />
    </template>
  </CCommonHeader>
  <CCard class="p-5 mt-5">
    <RouterView />
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
import { useBooksStore } from "@/modules/Books/store";
import { useRoute, useRouter } from "vue-router";
import { computed, ref, watch } from "vue";
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import CButton from "@/components/Common/CButton.vue";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import dayjs from "dayjs";
import { formatMoneyDecimal } from "@/utils";
import { useI18n } from "vue-i18n";
import CCard from "@/components/Card/CCard.vue";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useMounted } from "@/composables/useMounted";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";
import ApiService from "@/services/ApiService";

const route = useRoute();
const router = useRouter();
const { mounted } = useMounted();
const { t } = useI18n();

const booksStore = useBooksStore();
booksStore.fetchSingleBook(route.params.id);

const book = computed(() => booksStore.book);

const showDelete = ref(false);
const deleteLoading = ref(false);
const selectedBook = ref(0);

function onDeleteBook(id: number) {
  deleteLoading.value = true;
  ApiService.post("/backoffice/DeleteBook/", {
    book: id,
  })
    .then(() => {
      showDelete.value = false;
      router.push("/books");
    })
    .finally(() => (deleteLoading.value = false));
}

const activeTab = ref(route.name || "BooksSingleAbout");

const tabs = [
  {
    label: t("about_book"),
    value: "BooksSingleAbout",
  },
  {
    label: t("sales"),
    value: "BooksSingleSales",
  },
];

const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("books"),
    route: "/books",
  },
  {
    name: book.value?.title,
    route: "/",
  },
]);

watch(
  activeTab,
  () => {
    router.push({ name: activeTab.value });
  },
  { immediate: true }
);
</script>
