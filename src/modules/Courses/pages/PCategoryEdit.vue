<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <CPageHeader
    title="edit_category"
    :accept-btn="{
      text: 'save',
      disabled:
        form.$v.value.$invalid ||
        !(
          form.values.title_uz.length ||
          form.values.title_ru.length ||
          form.values.title_en.length
        ),
      loading: createLoading,
    }"
    @on-create="onCreate"
    @on-cancel="router.push('/categories')"
  />
  <div class="grid mt-6 gap-x-5 grid-cols-12">
    <CCard class="p-6 col-span-9 flex flex-col gap-y-4">
      <p class="text-xl font-semibold text-dark-400">
        {{ t("general_information") }}
      </p>
      <CTabLang v-model="nameValue" :list="tabListLanguage" withIcon />
      <FGroup v-if="nameValue === 'uz'" :label="$t('title_uz')">
        <FInput
          v-model="form.values.title_uz"
          :placeholder="$t('enter_title_uz')"
          :error="form.$v.value.title_uz.$error"
        />
      </FGroup>
      <FGroup v-if="nameValue === 'ru'" :label="$t('title_ru')">
        <FInput
          v-model="form.values.title_ru"
          :placeholder="$t('enter_title_ru')"
          :error="form.$v.value.title_ru.$error"
        />
      </FGroup>
      <FGroup v-if="nameValue === 'en'" :label="$t('title_en')">
        <FInput
          v-model="form.values.title_en"
          :placeholder="$t('enter_title_en')"
          :error="form.$v.value.title_en.$error"
        />
      </FGroup>
      <FGroup v-if="nameValue === 'uz'" :label="$t('subtitle_uz')">
        <FTextarea
          v-model="form.values.description_uz"
          :placeholder="$t('enter_subtitle_uz')"
          :maxlength="500"
        />
      </FGroup>
      <FGroup v-if="nameValue === 'ru'" :label="$t('subtitle_ru')">
        <FTextarea
          v-model="form.values.description_ru"
          :placeholder="$t('enter_subtitle_ru')"
          :maxlength="500"
        />
      </FGroup>
      <FGroup v-if="nameValue === 'en'" :label="$t('subtitle_en')">
        <FTextarea
          v-model="form.values.description_en"
          :placeholder="$t('enter_subtitle_en')"
          :maxlength="500"
        />
      </FGroup>
    </CCard>
    <CCard class="p-5 col-span-3 flex flex-col gap-y-2 h-fit">
      <p class="text-sm text-dark-400">{{ $t("cover") }}</p>
      <ImageUploader
        v-model="form.values.photo"
        :error="form.$v.value.photo.$error"
        :default-image="category?.photo"
        @change="form.values.photo = $event"
      />
    </CCard>
  </div>
</template>
<script setup lang="ts">
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useMounted } from "@/composables/useMounted";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import CPageHeader from "@/components/CPageHeader.vue";
import CCard from "@/components/Card/CCard.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import CTabLang from "@/components/Tab/CTabLang.vue";
import { tabListLanguage } from "@/modules/Courses/data.ts";
import FTextarea from "@/components/Form/FTextarea.vue";
import ImageUploader from "@/components/Form/Uploader/ImageUploader.vue";
import ApiService from "@/services/ApiService";
import { useCustomToast } from "@/composables/useCustomToast";
import { useRoute, useRouter } from "vue-router";
import { useCoursesStore } from "@/modules/Courses/store.ts";
import { richTextPurify } from "@/utils";

const { mounted } = useMounted();
const route = useRoute();
const { t } = useI18n();
const { showToast } = useCustomToast();
const router = useRouter();
const courseStore = useCoursesStore();
courseStore.fetchCategorySingle(String(route.params.categoryId));

const category = computed(() => courseStore.categorySingle);
const nameValue = ref<string>("uz");
const createLoading = ref(false);

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
    name: t("edit_category"),
    route: "/",
  },
]);

const form = useForm(
  {
    title_uz: "",
    title_ru: "",
    title_en: "",
    description_uz: "",
    description_ru: "",
    description_en: "",
    photo: "",
  },
  {
    title_uz: { required },
    title_ru: { required },
    title_en: { required },
    photo: { required },
  }
);

function updateData() {
  form.values.title_uz = category.value?.title_uz;
  form.values.title_ru = category.value?.title_ru;
  form.values.title_en = category.value?.title_en;
  form.values.description_uz = richTextPurify(category.value?.description_uz);
  form.values.description_ru = richTextPurify(category.value?.description_ru);
  form.values.description_en = richTextPurify(category.value?.description_en);
  form.values.photo = category.value?.photo;
}

watch(
  () => category.value,
  () => updateData()
);

function onCreate() {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    createLoading.value = true;

    // Determine which fields have changed
    const changedData: Record<string, any> = {};
    if (form.values.title_uz !== category.value?.title_uz) {
      changedData.title_uz = form.values.title_uz;
    }
    if (form.values.title_ru !== category.value?.title_ru) {
      changedData.title_ru = form.values.title_ru;
    }
    if (form.values.title_en !== category.value?.title_en) {
      changedData.title_en = form.values.title_en;
    }
    if (
      form.values.description_uz !==
      richTextPurify(category.value?.description_uz)
    ) {
      changedData.description_uz = form.values.description_uz;
    }
    if (
      form.values.description_ru !==
      richTextPurify(category.value?.description_ru)
    ) {
      changedData.description_ru = form.values.description_ru;
    }
    if (
      form.values.description_en !==
      richTextPurify(category.value?.description_en)
    ) {
      changedData.description_en = form.values.description_en;
    }
    if (form.values.photo?.id !== category.value?.photo?.id) {
      changedData.photo = form.values.photo?.id;
    }

    // Only send request if there are changes
    if (Object.keys(changedData).length > 0) {
      ApiService.patch(
        `/backoffice/CourseCategoryUpdate/${route.params.categoryId}/`,
        changedData
      )
        .then(() => {
          showToast(t("category_updated_successfully"), "success");
          router.push("/categories");
        })
        .catch((err) => {
          showToast(err, "error");
        })
        .finally(() => (createLoading.value = false));
    } else {
      router.push("/categories");
      createLoading.value = false;
    }
  }
}
</script>
