<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <CPageHeader
    title="edit_book"
    :accept-btn="{ text: $t('save'), disabled: form.$v.value.$invalid }"
    @on-create="create"
    @on-cancel="router.push('/books')"
  />
  <div class="grid grid-cols-9 gap-x-5 mt-6">
    <CCard class="col-span-6 p-6">
      <p class="text-dark-400 text-xl font-semibold">
        {{ $t("general_information") }}
      </p>
      <div class="mt-4 grid grid-cols-2 gap-4">
        <CTabLang
          class="col-span-2"
          v-model="nameValue"
          :list="tabListLanguage"
          withIcon
        />
        <FGroup
          v-if="nameValue === 'uz'"
          class="col-span-2"
          :label="$t('title_uz')"
        >
          <FInput
            v-model="form.values.title_uz"
            :error="form.$v.value.title_uz.$error"
            :placeholder="$t('enter_title_uz')"
          />
        </FGroup>
        <FGroup
          v-if="nameValue === 'ru'"
          class="col-span-2"
          :label="$t('title_ru')"
        >
          <FInput
            v-model="form.values.title_ru"
            :error="form.$v.value.title_ru.$error"
            :placeholder="$t('enter_title_ru')"
          />
        </FGroup>
        <FGroup
          v-if="nameValue === 'en'"
          class="col-span-2"
          :label="$t('title_en')"
        >
          <FInput
            v-model="form.values.title_en"
            :error="form.$v.value.title_en.$error"
            :placeholder="$t('enter_title_en')"
          />
        </FGroup>
        <FGroup
          v-if="nameValue === 'uz'"
          class="col-span-2"
          :label="$t('about_book_uz')"
        >
          <CRichText
            :default-data="form.values.description_uz"
            :error="form.$v.value.description_uz.$error"
            @editor="(val) => (form.values.description_uz = val)"
          />
        </FGroup>
        <FGroup
          v-if="nameValue === 'ru'"
          class="col-span-2"
          :label="$t('about_book_ru')"
        >
          <CRichText
            :default-data="form.values.description_ru"
            :error="form.$v.value.description_ru.$error"
            @editor="(val) => (form.values.description_ru = val)"
          />
        </FGroup>
        <FGroup
          v-if="nameValue === 'en'"
          class="col-span-2"
          :label="$t('about_book_en')"
        >
          <CRichText
            :default-data="form.values.description_en"
            :error="form.$v.value.description_en.$error"
            @editor="(val) => (form.values.description_en = val)"
          />
        </FGroup>
        <FGroup class="col-span-2" :label="$t('author')">
          <FInput
            v-model="form.values.author"
            :error="form.$v.value.author.$error"
            :placeholder="$t('enter_author')"
          />
        </FGroup>
        <FGroup :label="$t('pages')">
          <FInput
            v-model="form.values.pages"
            :error="form.$v.value.pages.$error"
            :placeholder="$t('pages_count')"
          />
        </FGroup>
        <FGroup :label="$t('price_book')">
          <FInput
            v-model="form.values.price"
            :error="form.$v.value.price.$error"
            :placeholder="$t('enterPrice')"
          />
        </FGroup>
        <FGroup class="col-span-2" :label="$t('discountInPercent')">
          <FInput
            v-model="form.values.discount.percentage"
            :placeholder="$t('enterDiscountPercentage')"
          />
        </FGroup>
        <FGroup :label="$t('discountStartDate')">
          <FDatePicker
            :min-date="new Date()"
            v-model="form.values.discount.start_date"
          />
        </FGroup>
        <FGroup :label="$t('discountEndDate')">
          <FDatePicker
            :min-date="new Date(form.values.discount.start_date)"
            v-model="form.values.discount.end_date"
          />
        </FGroup>
      </div>
    </CCard>
    <div class="col-span-3">
      <CCard class="p-5">
        <p class="text-sm text-dark-400 mb-2">{{ $t("upload_book") }}</p>
        <CBookUploader
          id="book_uz"
          :defaultFile="{
            name: form.values.title_uz,
            url: form.values.file_uz,
          }"
          :error="form.$v.value.file_uz.$error"
          accept=".pdf"
          @file-selected="form.values.file_uz = $event"
        >
          <template #default>
            <div class="flex-center flex-col">
              <i class="icon-book text-4.5xl text-blueDark" />
              <p class="text-sm font-medium">{{ $t("upload_book_uz") }}</p>
              <p class="text-xs text-center text-gray-450">
                {{ $t("add_book_here_uz") }}
              </p>
            </div>
          </template>
        </CBookUploader>
        <CBookUploader
          id="book_ru"
          class="mt-2"
          :defaultFile="{
            name: form.values.title_ru,
            url: form.values.file_ru,
          }"
          :error="form.$v.value.file_ru.$error"
          accept=".pdf"
          @file-selected="form.values.file_ru = $event"
        >
          <template #default>
            <div class="flex-center flex-col">
              <i class="icon-book text-4.5xl text-blueDark" />
              <p class="text-sm font-medium">{{ $t("upload_book_ru") }}</p>
              <p class="text-xs text-center text-gray-450">
                {{ $t("add_book_here_ru") }}
              </p>
            </div>
          </template>
        </CBookUploader>
        <CBookUploader
          id="book_en"
          class="mt-2"
          :defaultFile="{
            name: form.values.title_en,
            url: form.values.file_en,
          }"
          :error="form.$v.value.file_en.$error"
          accept=".pdf"
          @file-selected="form.values.file_en = $event"
        >
          <template #default>
            <div class="flex-center flex-col">
              <i class="icon-book text-4.5xl text-blueDark" />
              <p class="text-sm font-medium">{{ $t("upload_book_en") }}</p>
              <p class="text-xs text-center text-gray-450">
                {{ $t("add_book_here_en") }}
              </p>
            </div>
          </template>
        </CBookUploader>
      </CCard>
      <CCard class="p-5 mt-4">
        <p class="text-sm mb-2 text-dark-400">{{ $t("cover") }}</p>
        <ImageUploader
          v-model="form.values.cover"
          :default-image="book?.main_image"
          :error="form.$v.value.cover.$error"
          @change="form.values.cover = $event?.file"
        />
      </CCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useMounted } from "@/composables/useMounted";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import CPageHeader from "@/components/CPageHeader.vue";
import CCard from "@/components/Card/CCard.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import { useForm } from "@/composables/useForm";
import FDatePicker from "@/components/Form/Date/FDatePicker.vue";
import CRichText from "@/components/CRichText.vue";
import CBookUploader from "@/components/Form/Uploader/CBookUploader.vue";
import ImageUploader from "@/components/Form/Uploader/ImageUploader.vue";
import { required } from "@vuelidate/validators";
import CTabLang from "@/components/Tab/CTabLang.vue";
import { tabListLanguage } from "@/modules/Courses/data.ts";
import ApiService from "@/services/ApiService";
import { useRoute, useRouter } from "vue-router";
import { useCustomToast } from "@/composables/useCustomToast";
import { useBooksStore } from "@/modules/Books/store";

const { mounted } = useMounted();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { showToast } = useCustomToast();
const booksStore = useBooksStore();

booksStore.fetchSingleBook(String(route.params.id));

const book = computed(() => booksStore.book);

const loading = ref(false);

const form = useForm(
  {
    title_uz: "",
    title_ru: "",
    title_en: "",
    author: "",
    price: "",
    discount: {
      percentage: "",
      start_date: "",
      end_date: "",
    },
    description_uz: "",
    description_ru: "",
    description_en: "",
    file_uz: {},
    file_ru: {},
    file_en: {},
    cover: {},
    pages: "",
  },
  {
    title_uz: { required },
    title_ru: { required },
    title_en: { required },
    author: { required },
    description_uz: { required },
    description_ru: { required },
    description_en: { required },
    file_uz: { required },
    file_ru: { required },
    file_en: { required },
    price: { required },
    pages: { required },
    cover: { required },
  }
);

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
    name: t("edit_book"),
    route: "/",
  },
]);

function updateForm() {
  form.values.title_uz = book.value?.title_uz;
  form.values.title_ru = book.value?.title_ru;
  form.values.title_en = book.value?.title_en;
  form.values.author = book.value?.author;
  form.values.price = book.value?.price;
  form.values.discount.percentage = book.value?.discount?.percentage;
  form.values.discount.start_date = book.value?.discount?.start_date
    .split("-")
    .reverse()
    .join(".");
  form.values.discount.end_date = book.value?.discount?.end_date
    .split("-")
    .reverse()
    .join(".");
  form.values.description_uz = book.value?.description_uz;
  form.values.description_ru = book.value?.description_ru;
  form.values.description_en = book.value?.description_en;
  form.values.file_uz = book.value?.file_uz;
  form.values.file_ru = book.value?.file_ru;
  form.values.file_en = book.value?.file_en;
  form.values.cover = book?.value?.main_image;
  form.values.pages = book.value?.pages;
}

watch(
  () => book.value,
  () => updateForm()
);

const nameValue = ref<string>("uz");

function create() {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    loading.value = true;

    const patchData: Record<string, any> = {};
    const currentData = {
      title_uz: book.value?.title_uz,
      title_ru: book.value?.title_ru,
      title_en: book.value?.title_en,
      author: book.value?.author,
      price: book.value?.price,
      discount: {
        percentage: book.value?.discount,
        start_date: book.value?.discount_start_date,
        end_date: book.value?.discount_end_date,
      },
      description_uz: book.value?.description_uz,
      description_ru: book.value?.description_ru,
      description_en: book.value?.description_en,
      file_uz: book.value?.file_uz,
      file_ru: book.value?.file_ru,
      file_en: book.value?.file_en,
      cover: book.value?.main_image,
      pages: book.value?.pages,
    };

    // Compare current and form data
    for (const key in form.values) {
      if (
        (key.includes("book_") || key === "cover") &&
        form.values[key] instanceof File
      ) {
        patchData[key] = form.values[key]; // Handle file uploads
      } else if (key === "discount") {
        if (form.values.discount.percentage) {
          patchData["discount.percentage"] = form.values.discount.percentage;
        }
        patchData["discount.start_date"] = form.values.discount.start_date
          ? form.values.discount.start_date.split(".").reverse().join("-")
          : "";
        patchData["discount.end_date"] = form.values.discount.end_date
          ? form.values.discount.end_date.split(".").reverse().join("-")
          : "";
      } else if (form.values[key] !== currentData[key]) {
        patchData[key] = form.values[key];
      }
    }

    if (Object.keys(patchData).length === 0) {
      loading.value = false;
      showToast(t("changes_saved"), "success");
      router.push("/books");
      return;
    }

    const patchPayload = new FormData();
    for (const key in patchData) {
      if (patchData[key] instanceof File) {
        patchPayload.append(key, patchData[key]);
      } else {
        patchPayload.append(key, patchData[key]);
      }
    }

    ApiService.patch(`/backoffice/UpdateBook/${route.params.id}/`, patchPayload)
      .then(() => {
        showToast(t("changes_saved"), "success");
        router.push("/books");
      })
      .catch((error) => {
        showToast(error.message || t("error_saving_changes"), "error");
      })
      .finally(() => {
        loading.value = false;
      });
  }
}
</script>
