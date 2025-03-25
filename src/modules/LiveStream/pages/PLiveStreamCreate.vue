<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div>
    <CPageHeader
      title="add_live_stream"
      :accept-btn="{
        text: 'save',
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
    <CStreamCreateForm v-bind="{ form }" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useMounted } from "@/composables/useMounted";
import { useI18n } from "vue-i18n";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CPageHeader from "@/components/CPageHeader.vue";
import { useForm } from "@/composables/useForm";
import { minLength, required, requiredIf } from "@vuelidate/validators";
import ApiService from "@/services/ApiService";
import { useHandleError } from "@/composables/useHandleError";
import { useRouter } from "vue-router";
import { useCustomToast } from "@/composables/useCustomToast";
import CStreamCreateForm from "@/modules/LiveStream/Components/CStreamCreateForm.vue";

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
    name: t("live_stream"),
    route: "/live-stream",
  },
  {
    name: t("add_live_stream"),
    route: "/",
  },
]);

const buttonLoading = ref(false);
const isYouTubeURL = (value: string) => {
  const pattern = /^(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
  return pattern.test(value);
};

const form = useForm(
  {
    youtube_url: "",
    description: "",
    cover: "",
    group: "",
    title: "",
    toggle: false,
  },
  {
    youtube_url: { required, minLength: minLength(6), isYouTubeURL },
    title: { required },
    cover: { required },
    group: { requiredIf: requiredIf(() => !form.values.toggle) },
    description: { required, minLength: minLength(6) },
  }
);

const onCancel = () => {
  router.push({ name: "PLiveStream" });
};
const extractIds = (array) => array.map((item) => item.id);
const onCreate = () => {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    buttonLoading.value = true;

    const data = {
      title: form.values.title,
      description: form.values.description,
      youtube_url: form.values.youtube_url,
      group: !form.values.toggle ? extractIds(form.values.group) : [], // Adjust group based on toggle
      photo: form.values.cover?.id,
      for_all: form.values.toggle,
    };

    ApiService.post("study/live-streams/create/", data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        showToast(t("course_created_successfully"), "success");
        router.push({ name: "PLiveStream", query: { course: res?.data?.id } });
      })
      .catch(({ response }) => {
        handleError(response);
      })
      .finally(() => {
        buttonLoading.value = false;
      });
  }
};
</script>
