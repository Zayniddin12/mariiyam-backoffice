<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div>
    <CPageHeader
      title="course_edit"
      :accept-btn="{
        disabled: form.$v.value.$invalid,
        text: 'edit',
        loading: buttonLoading,
      }"
      :cancel-btn="{
        disabled: false,
        text: 'cancel',
        loading: false,
      }"
      @on-cancel="onCancel"
      @on-create="onCreate"
    />
    <CCourseCreateForm v-bind="{ form, loading }" />
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useMounted } from "@/composables/useMounted";
import { useI18n } from "vue-i18n";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CPageHeader from "@/components/CPageHeader.vue";
import CCourseCreateForm from "@/modules/Courses/components/CCourseCreateForm.vue";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import { useRoute, useRouter } from "vue-router";
import ApiService from "@/services/ApiService";
import { useHandleError } from "@/composables/useHandleError";
import dayjs from "dayjs";
import { richTextPurify } from "@/utils";

const { t } = useI18n();
const { mounted } = useMounted();
const route = useRoute();
const { handleError } = useHandleError();
const router = useRouter();

const single = ref({});
const buttonLoading = ref(false);
const loading = ref(false);

function getSingle() {
  ApiService.get(`backoffice/Courses/${route.params?.id}`)
    .then((res) => {
      single.value = res?.data;
    })
    .finally(() => (loading.value = false));
}

getSingle();

const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("courses"),
    route: "/courses",
  },
  {
    name: t("course_edit"),
    route: "/",
  },
]);
const form = useForm(
  {
    title: "",
    title_uz: "",
    title_ru: "",
    title_en: "",
    subtitle: "",
    subtitle_uz: "",
    subtitle_ru: "",
    subtitle_en: "",
    category: "",
    price: null,
    discountPrice: null,
    is_auto: false,
    discount: {
      percentage: null,
      start_date: "",
      end_date: "",
    },
    cover: "",
  },
  {
    title_uz: { required },
    title_ru: { required },
    title_en: { required },
    subtitle: { required },
    subtitle_uz: { required },
    subtitle_ru: { required },
    subtitle_en: { required },
    price: { required },
    cover: { required },
  }
);

const calculateChangedFields = (
  original: Record<string, any>,
  updated: Record<string, any>
) => {
  const changes: Record<string, any> = {};
  for (const key in updated) {
    if (JSON.stringify(original[key]) !== JSON.stringify(updated[key])) {
      changes[key] = updated[key];
    }
  }
  return changes;
};

const onCancel = () => {
  router.push({ name: "Courses" });
};

const onCreate = () => {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    buttonLoading.value = true;

    const transformedForm = {
      title:
        form.values.title_uz ?? form.values.title_ru ?? form.values.title_en,
      title_uz: form.values.title_uz,
      title_ru: form.values.title_ru,
      title_en: form.values.title_en,
      description:
        form.values.subtitle_uz ??
        form.values.subtitle_ru ??
        form.values.subtitle_en,
      description_uz: form.values.subtitle_uz,
      description_ru: form.values.subtitle_ru,
      description_en: form.values.subtitle_en,
      photo:
        typeof form.values.cover === "string"
          ? undefined
          : form.values.cover?.id,
      header: form.values.category,
      is_auto: form.values.is_auto,
      price:
        String(form.values.price).replace(/\s+/g, "").replace(/,/g, "") ||
        undefined,
      discount: form.values.discount.percentage
        ? {
            percentage: form.values.discount.percentage.replace("%", ""),
            start_date: form.values.discount.start_date
              .split(".")
              .reverse()
              .join("-"),
            end_date: form.values.discount.end_date
              .split(".")
              .reverse()
              .join("-"),
          }
        : undefined,
    };

    const changedData = calculateChangedFields(single.value, transformedForm);

    if (Object.keys(changedData).length > 0) {
      ApiService.patch(
        `backoffice/UpdateCourses/${route?.params?.id}/`,
        changedData
      )
        .then(() => {
          router.push({ name: "Courses" });
        })
        .catch(({ response }) => {
          handleError(response);
        })
        .finally(() => (buttonLoading.value = false));
    } else {
      buttonLoading.value = false; // No changes to save
    }
  }
};

watch(
  () => single.value,
  () => {
    form.values.title = single?.value?.title;
    form.values.title_uz = single?.value?.title_uz;
    form.values.title_ru = single?.value?.title_ru;
    form.values.title_en = single?.value?.title_en;
    form.values.subtitle = single?.value?.description;
    form.values.subtitle_uz = richTextPurify(single?.value?.description_uz);
    form.values.subtitle_ru = richTextPurify(single?.value?.description_ru);
    form.values.subtitle_en = richTextPurify(single?.value?.description_en);
    form.values.cover = single?.value?.photo;
    form.values.is_auto = single?.value?.is_auto;
    form.values.category = single?.value?.header;
    form.values.discount = {
      percentage: single?.value?.discount?.percentage,
      start_date:
        dayjs(new Date(single?.value?.discount?.start_date)).format(
          "DD.MM.YYYY"
        ) || "",
      end_date:
        dayjs(new Date(single?.value?.discount?.end_date)).format(
          "DD.MM.YYYY"
        ) || "",
    };

    form.values.price = single?.value?.price;
  }
);
</script>
