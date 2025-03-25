<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div>
    <CPageHeader
      :accept-btn="{
        disabled: form.$v.value.$invalid,
        text: 'create',
        loading: buttonLoading,
      }"
      title="course_create"
      :cancel-btn="{
        disabled: false,
        text: 'cancel',
        loading: false,
      }"
      @on-cancel="onCancel"
      @on-create="onCreate"
    />
    <CCourseCreateForm v-bind="{ form }" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useMounted } from "@/composables/useMounted";
import { useI18n } from "vue-i18n";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CPageHeader from "@/components/CPageHeader.vue";
import CCourseCreateForm from "@/modules/Courses/components/CCourseCreateForm.vue";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import ApiService from "@/services/ApiService";
import { useHandleError } from "@/composables/useHandleError";
import { useRouter } from "vue-router";
import { useCustomToast } from "@/composables/useCustomToast";

const { t } = useI18n();
const { showToast } = useCustomToast();
const { mounted } = useMounted();
const { handleError } = useHandleError();
const router = useRouter();

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
    name: t("course_create"),
    route: "/",
  },
]);

const buttonLoading = ref(false);

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
    price: { required },
    title_uz: { required },
    title_ru: { required },
    title_en: { required },
    subtitle_uz: { required },
    subtitle_ru: { required },
    subtitle_en: { required },
    // discount: {
    //   percentage: { required },
    //   start_date: { required },
    //   end_date: { required },
    // },
    cover: { required },
  }
);
const onCancel = () => {
  router.push({ name: "Courses" });
};

const onCreate = () => {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    buttonLoading.value = true;
    const data = {
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
      photo: form.values.cover?.id,
      is_auto: form.values.is_auto,
      header: form.values.category,
      price:
        form.values.price.replace(/\s+/g, "").replace(/,/g, "") || undefined,
      discount: form.values.discount.percentage
        ? {
            percentage: form.values.discount.percentage.replace("%", ""),
            start_date: formatDate(form.values.discount.start_date),
            end_date: formatDate(form.values.discount.end_date),
          }
        : undefined,
    };
    ApiService.post("backoffice/CreateCourses/", data)
      .then((res: any) => {
        showToast(t("course_created_successfully"), "success");
        router.push({ name: "Courses", query: { course: res?.data?.id } });
      })
      .catch(({ response }) => {
        handleError(response);
      })
      .finally(() => (buttonLoading.value = false));
  }
};

function formatDate(dateString) {
  const [day, month, year] = dateString.split(".");
  return `${year}-${month}-${day}`;
}
</script>
