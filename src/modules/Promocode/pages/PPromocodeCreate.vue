<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div>
    <CPageHeader
      title="promocode_create"
      :accept-btn="{
        disabled: form.$v.value.$invalid,
        text: 'create',
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
    <CPromocodeCreateForm v-bind="{ form }" />
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
import CPromocodeCreateForm from "@/modules/Promocode/components/CPromocodeCreateForm.vue";

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
    name: t("promocode"),
    route: "/promocode",
  },
  {
    name: t("promocode_create"),
    route: "/promocode-create",
  },
]);

const buttonLoading = ref(false);

const form = useForm(
  {
    title: "",
    code: "",
    amount: "",
    start_date: "",
    end_date: "",
    usage: "",
  },
  {
    title: { required },
    code: { required },
    end_date: { required },
    start_date: { required },
    usage: { required },
    amount: { required },
  }
);
const onCancel = () => {
  router.push({ name: "Promocode" });
};

const onCreate = () => {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    buttonLoading.value = true;
    const data = {
      title: form.values.title,
      code: form.values.code,
      amount: form.values.amount.replace(/\s+/g, "").replace(/,/g, ""),
      usage: form.values.usage.replace(/\s+/g, "").replace(/,/g, ""),
      start_date: formatDate(form.values.start_date),
      end_date: formatDate(form.values.end_date),
    };
    ApiService.post("/backoffice/promo-code/create/", data)
      .then((res: any) => {
        showToast(t("course_created_successfully"), "success");
        router.push({ name: "Promocode", query: { course: res?.data?.id } });
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
