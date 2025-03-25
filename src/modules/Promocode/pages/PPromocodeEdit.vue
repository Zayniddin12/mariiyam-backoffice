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
    <CPromocodeCreateForm v-bind="{ form, loading }" />
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useMounted } from "@/composables/useMounted";
import { useI18n } from "vue-i18n";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CPageHeader from "@/components/CPageHeader.vue";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import { useRoute, useRouter } from "vue-router";
import ApiService from "@/services/ApiService";
import { useHandleError } from "@/composables/useHandleError";
import CPromocodeCreateForm from "@/modules/Promocode/components/CPromocodeCreateForm.vue";

const { t } = useI18n();
const { mounted } = useMounted();
const route = useRoute();
const { handleError } = useHandleError();
const router = useRouter();

const single = ref({});
const buttonLoading = ref(false);
const loading = ref(false);

function getSingle() {
  ApiService.get(`/study/promo-code/use-history/${route.params?.promocodeId}`)
    .then((res) => {
      single.value = {
        ...res?.data?.promo_detail,
        start_date: res?.data?.promo_detail?.start_date,
        end_date: res?.data?.promo_detail?.end_date,
      };
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
  router.push({ name: "Courses" });
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
    ApiService.patch(
      `/backoffice/promo-code/update/${route?.params?.promocodeId}/`,
      data
    )
      .then(() => {
        router.push({ name: "Promocode" });
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

watch(
  () => single.value,
  () => {
    form.values.title = single?.value?.title;
    form.values.code = single?.value?.code;
    form.values.amount = single?.value?.amount;
    form.values.start_date = single?.value?.start_date;
    form.values.end_date = single?.value?.end_date;
    form.values.usage = single?.value?.usage;
  }
);
</script>
