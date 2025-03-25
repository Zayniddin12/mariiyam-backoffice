<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div class="grid grid-cols-12 gap-5">
    <div class="col-span-4">
      <CGroupAddSteps v-bind="{ step, steps }" />
    </div>
    <div class="col-span-8">
      <CModuleCreateStepInfo
        v-if="step === 1"
        :form="infoForm"
        @next="step = 2"
        @back="router.push(`/courses/${route.params.courseId}/module`)"
      />
      <CModuleCreateLessons
        :default-lessons="lessons"
        v-if="step === 2"
        @next="toStepThree($event)"
        @back="toStepOne"
      />
      <CModuleCreateFinal
        :submitting="submitting"
        v-if="step === 3"
        @back="step = 2"
        @next="submit"
        @modify="(data) => ml(data)"
        @delete="(data) => (lessons = data)"
        :form="infoForm"
        v-bind="{ lessons }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CGroupAddSteps from "@/modules/Courses/components/Groups/Create/CGroupAddSteps.vue";
import { useI18n } from "vue-i18n";
import { computed, provide, ref } from "vue";
import CModuleCreateStepInfo from "@/modules/Courses/components/Modules/Create/CModuleCreateStepInfo.vue";
import { useForm } from "@/composables/useForm";
import CModuleCreateLessons from "@/modules/Courses/components/Modules/Create/CModuleCreateLessons.vue";
import CModuleCreateFinal from "@/modules/Courses/components/Modules/Create/CModuleCreateFinal.vue";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useMounted } from "@/composables/useMounted";
import { useRoute, useRouter } from "vue-router";
import { required } from "@vuelidate/validators";
import ApiService from "@/services/ApiService";
import { useHandleError } from "@/composables/useHandleError";
import { useCustomToast } from "@/composables/useCustomToast";

const { t } = useI18n();
const { mounted } = useMounted();
const router = useRouter();
const route = useRoute();
const { handleError } = useHandleError();

const step = ref(1);
const lessons = ref([]);
const single = ref();
const { showToast } = useCustomToast();
const submitting = ref(false);

const infoForm = useForm(
  {
    name_uz: "",
    name_ru: "",
    name_en: "",
    days: "",
    image: null,
  },
  {
    name_uz: { required },
    name_ru: { required },
    name_en: { required },
    days: { required },
    image: { required },
  }
);

function submit() {
  submitting.value = true;

  console.log(lessons);

  const data = {
    course: route.params?.courseId,
    title:
      infoForm.values.name_uz ??
      infoForm.values.name_ru ??
      infoForm.values.name_en,
    title_uz: infoForm.values.name_uz,
    title_en: infoForm.values.name_en,
    title_ru: infoForm.values.name_ru,
    photo: infoForm.values.image?.id,
    duration_days: +infoForm.values.days,
    lessons: lessons.value.map((lesson: any) => {
      return {
        title: lesson.name_uz ?? lesson.name_en ?? lesson.name_ru,
        title_uz: lesson.name_uz,
        title_ru: lesson.name_ru,
        title_en: lesson.name_en,
        description: lesson.description_en,
        description_uz: lesson.description_uz,
        description_ru: lesson.description_ru,
        description_en: lesson.description_en,
        video: lesson.video_uz ?? lesson.video_ru ?? lesson.video_en,
        video_uz: lesson.video_uz,
        video_ru: lesson.video_ru,
        video_en: lesson.video_en,
        ball: lesson?.ball,
        is_open: lesson.is_open,
        files: lesson.files?.length
          ? lesson.files.map((file: any) => file.id)
          : undefined,
      };
    }),
  };

  ApiService.post("backoffice/CreateBulkModuleLesson/", data)
    .then(() => {
      showToast(t("module_create"), "success");
      router.push({
        name: "CourseSingle",
        params: { courseId: route.params?.courseId },
      });
    })
    .catch(({ response }) => handleError(response))
    .finally(() => {
      submitting.value = false;
    });
}

function getSingle() {
  ApiService.get(`/backoffice/Courses/${route.params.courseId}`).then((res) => {
    single.value = res?.data;
  });
}

getSingle();

const hasVideo = ref(false);

function toStepThree(data: any) {
  data?.forEach((i) => {
    hasVideo.value = !!i?.video_uz && !!i?.video_en && !!i?.video_ru;
  });
  provide("hasVideo", hasVideo.value);
  if (hasVideo.value) {
    lessons.value = data;
    hasVideo.value = true;
    provide("hasVideo", hasVideo.value);
  }
  step.value = 3;
}

function toStepOne(data: any) {
  lessons.value = data;
  step.value = 1;
}

function ml(list) {
  lessons.value = lessons.value?.map((lesson) => {
    return {
      ...lesson,
      files: list,
    };
  });
}

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
    name: single?.value?.title,
    route: `/courses/${route.params.courseId}`,
  },
  {
    name: t("add_module"),
    route: "/",
  },
]);

const steps = [
  {
    id: 1,
    title: t("about_module"),
    subtitle: t("general_information"),
  },
  {
    id: 2,
    title: t("lessons"),
    subtitle: t("add_lessons"),
  },
  {
    id: 3,
    title: t("checking"),
    subtitle: t("checking_entered_data"),
  },
];
</script>
