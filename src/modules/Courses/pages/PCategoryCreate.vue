<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <CPageHeader
    title="add_category"
    :accept-btn="{
      text: 'create',
      disabled: form.$v.value.$invalid,
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
        @change="form.values.photo = $event"
      />
    </CCard>
  </div>
</template>
<script setup lang="ts">
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useMounted } from "@/composables/useMounted";
import { computed, ref } from "vue";
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
import { useRouter } from "vue-router";

const { mounted } = useMounted();
const { t } = useI18n();
const { showToast } = useCustomToast();
const router = useRouter();

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
    name: t("add_new_category"),
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

function onCreate() {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    createLoading.value = true;
    const data = {
      title:
        form.values.title_uz ?? form.values.title_ru ?? form.values.title_en,
      title_uz: form.values.title_uz,
      title_ru: form.values.title_ru,
      title_en: form.values.title_en,
      description:
        form.values.description_uz ??
        form.values.description_ru ??
        form.values.description_en,
      description_uz: form.values.description_uz,
      description_ru: form.values.description_ru,
      description_en: form.values.description_en,
      photo: form.values.photo?.id,
    };
    ApiService.post("/backoffice/CourseCategoryCreate/", data)
      .then(() => {
        showToast(t("category_created_successfully"), "success");
        router.push("/categories");
      })
      .catch((err) => {
        showToast(err, "error");
      })
      .finally(() => (createLoading.value = false));
  }
}
</script>
