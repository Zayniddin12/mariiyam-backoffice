<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <CPageHeader
    title="add_book"
    :accept-btn="{
      text: $t('add'),
      disabled: form.$v.value.$invalid,
      loading: loading,
    }"
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
            :default-data="form.values.about_uz"
            :error="form.$v.value.about_uz.$error"
            @editor="(val) => (form.values.about_uz = val)"
          />
        </FGroup>
        <FGroup
          v-if="nameValue === 'ru'"
          class="col-span-2"
          :label="$t('about_book_ru')"
        >
          <CRichText
            :default-data="form.values.about_ru"
            :error="form.$v.value.about_ru.$error"
            @editor="(val) => (form.values.about_ru = val)"
          />
        </FGroup>
        <FGroup
          v-if="nameValue === 'en'"
          class="col-span-2"
          :label="$t('about_book_en')"
        >
          <CRichText
            :default-data="form.values.about_en"
            :error="form.$v.value.about_en.$error"
            @editor="(val) => (form.values.about_en = val)"
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
            v-maska="moneyMask"
            :error="form.$v.value.pages.$error"
            :placeholder="$t('pages_count')"
          />
        </FGroup>
        <FGroup :label="$t('price_book')">
          <FInput
            v-model="form.values.price"
            v-maska="moneyMask"
            :error="form.$v.value.price.$error"
            :placeholder="$t('enterPrice')"
          />
        </FGroup>
        <FGroup class="col-span-2" :label="$t('discountInPercent')">
          <FInput
            v-model="form.values.discount.percentage"
            v-maska="'###%'"
            :maxlength="100"
            :max="100"
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
            v-model="form.values.discount.end_date"
            :disabled="form.values.discount.start_date === ''"
            :min-date="
              new Date(formatDateRightOrder(form.values.discount.start_date))
            "
          />
        </FGroup>
      </div>
    </CCard>
    <div class="col-span-3">
      <CCard class="p-5">
        <p class="text-sm text-dark-400 mb-2">{{ $t("upload_book") }}</p>
        <CBookUploader
          id="book_uz"
          :error="form.$v.value.book_uz.$error"
          accept=".pdf"
          @file-selected="form.values.book_uz = $event"
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
          :error="form.$v.value.book_ru.$error"
          accept=".pdf"
          @file-selected="form.values.book_ru = $event"
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
          :error="form.$v.value.book_en.$error"
          accept=".pdf"
          @file-selected="form.values.book_en = $event"
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
import { useRouter } from "vue-router";
import { useCustomToast } from "@/composables/useCustomToast";
import { formatDateRightOrder, moneyMask } from "@/utils";

const { mounted } = useMounted();
const { t } = useI18n();
const router = useRouter();
const { showToast } = useCustomToast();

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
    about_uz: "",
    about_ru: "",
    about_en: "",
    book_uz: {},
    book_ru: {},
    book_en: {},
    cover: {},
    pages: "",
  },
  {
    title_uz: { required },
    title_ru: { required },
    title_en: { required },
    author: { required },
    about_uz: { required },
    about_ru: { required },
    about_en: { required },
    book_uz: { required },
    book_ru: { required },
    book_en: { required },
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
    name: t("add_book"),
    route: "/",
  },
]);

const nameValue = ref<string>("uz");

function create() {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    loading.value = true;
    const bookData = new FormData();
    const data = {
      title: form.values.title_en,
      title_en: form.values.title_en,
      title_ru: form.values.title_ru,
      title_uz: form.values.title_uz,
      description: form.values.about_en,
      description_en: form.values.about_en,
      description_ru: form.values.about_ru,
      description_uz: form.values.about_uz,
      price: Number(form.values.price.replaceAll(" ", "")),
      pages: Number(form.values.pages.replaceAll(" ", "")),
      author: form.values.author,
      file: form.values.book_en,
      file_en: form.values.book_en,
      file_uz: form.values.book_uz,
      file_ru: form.values.book_ru,
      main_image: form.values.cover,
      "discount.percentage": form.values.discount.percentage,
      "discount.start_date": form.values.discount.start_date
        .split(".")
        .reverse()
        .join("-"),
      "discount.end_date": form.values.discount.end_date
        .split(".")
        .reverse()
        .join("-"),
    };

    // Append fields to FormData
    for (const key in data) {
      bookData.append(key, data[key]);
    }

    ApiService.post("/backoffice/CreateBook/", bookData)
      .then(() => {
        router.push("/books");
      })
      .catch((error) => {
        showToast(error, "error");
      })
      .finally(() => {
        loading.value = false;
      });
  }
}
</script>
