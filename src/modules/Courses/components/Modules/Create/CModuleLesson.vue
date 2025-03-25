<template>
  <CCard class="p-5">
    <p class="text-xl leading-130 font-semibold">{{ lesson?.title }}</p>
    <div class="mt-4 flex flex-col gap-4">
      <FGroup
        :label="$t('upload_video_uz')"
        wrapper-class="!justify-start gap-1"
      >
        <CVideoUploader
          @on-change="lesson.video_uz = $event"
          @on-status="$emit('on-status', $event)"
          :default="lesson?.video_uz"
          :error="v$.video_uz?.$error"
        />
        <template #labelOpposite>
          <p class="text-xs leading-normal font-normal text-gray">
            {{ $t("max_limit", { limit: 100 }) }}
          </p>
        </template>
      </FGroup>
      <FGroup
        :label="$t('upload_video_ru')"
        wrapper-class="!justify-start gap-1"
      >
        <CVideoUploader
          @on-change="lesson.video_ru = $event"
          @on-status="$emit('on-status', $event)"
          :default="lesson?.video_ru"
          :error="v$.video_ru?.$error"
        />
        <template #labelOpposite>
          <p class="text-xs leading-normal font-normal text-gray">
            {{ $t("max_limit", { limit: 100 }) }}
          </p>
        </template>
      </FGroup>
      <FGroup
        :label="$t('upload_video_en')"
        wrapper-class="!justify-start gap-1"
      >
        <CVideoUploader
          @on-change="lesson.video_en = $event"
          @on-status="$emit('on-status', $event)"
          :default="lesson?.video_en"
          :error="v$.video_en?.$error"
        />
        <template #labelOpposite>
          <p class="text-xs leading-normal font-normal text-gray">
            {{ $t("max_limit", { limit: 100 }) }}
          </p>
        </template>
      </FGroup>
      <FGroup :label="$t('automatic')" class="mt-4">
        <FCheckbox
          :checked="lesson.is_open || false"
          class="translate-y-0.5 w-fit"
          v-model="lesson.is_open"
          @change="lesson.is_open = !lesson.is_open"
        />
      </FGroup>
      <div class="w-full h-px bg-gray-900 my-4" />
      <CTabLang v-model="nameValue" :list="tabListLanguage" withIcon />
      <FGroup v-if="nameValue === 'uz'" :label="$t('name_uz')">
        <FInput
          :placeholder="$t('enter_name_uz')"
          v-model="lesson.name_uz"
          :error="v$.name_uz?.$error"
        />
      </FGroup>
      <FGroup v-if="nameValue === 'ru'" :label="$t('name_ru')">
        <FInput
          :placeholder="$t('enter_name_ru')"
          v-model="lesson.name_ru"
          :error="v$.name_ru?.$error"
        />
      </FGroup>
      <FGroup v-if="nameValue === 'en'" :label="$t('name_en')">
        <FInput
          :placeholder="$t('enter_name_en')"
          v-model="lesson.name_en"
          :error="v$.name_en?.$error"
        />
      </FGroup>
      <FGroup v-if="nameValue === 'uz'" :label="$t('lesson_description_uz')">
        <FTextarea
          v-model="lesson.description_uz"
          :error="v$.description_uz?.$error"
          :placeholder="$t('enter_lesson_description_uz')"
        />
      </FGroup>
      <FGroup v-if="nameValue === 'ru'" :label="$t('lesson_description_ru')">
        <FTextarea
          v-model="lesson.description_ru"
          :error="v$.description_ru?.$error"
          :placeholder="$t('enter_lesson_description_ru')"
        />
      </FGroup>
      <FGroup v-if="nameValue === 'en'" :label="$t('lesson_description_en')">
        <FTextarea
          v-model="lesson.description_en"
          :error="v$.description_en?.$error"
          :placeholder="$t('enter_lesson_description_en')"
        />
      </FGroup>
      <div class="w-full h-px bg-gray-900 my-4" />
      <FGroup :label="$t('point_by_lesson')">
        <FInput
          placeholder="0"
          v-maska="'####'"
          v-model="lesson.ball"
          :error="v$.ball?.$error"
        />
      </FGroup>
      <div>
        <div class="flex-y-center gap-3">
          <p
            class="text-sm leading-normal font-normal text-dark-100 cursor-pointer"
            @click="lesson.extraFiles = !lesson.extraFiles"
          >
            {{ $t("extra_files") }}
            <span class="text-xs text-gray">{{
              $t("each_50_mb", { mb: 50 })
            }}</span>
          </p>
          <FToggle v-model="lesson.extraFiles" />
        </div>
        <CollapseTransition>
          <div v-show="lesson.extraFiles" class="pt-2 flex flex-col gap-2">
            <MultipleFileUploader
              accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .csv, .zip, .rar"
              @change="lesson.files = $event"
              :default-images="lesson?.files"
              :clear="!lesson.extraFiles"
            />
          </div>
        </CollapseTransition>
      </div>
    </div>
  </CCard>
</template>

<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import CVideoUploader from "@/components/Form/Uploader/CVideoUploader.vue";
import FTextarea from "@/components/Form/FTextarea.vue";
import FToggle from "@/components/Form/FToggle.vue";
import { inject, ref, unref } from "vue";
import MultipleFileUploader from "@/components/Form/Uploader/MultipleFileUploader.vue";
import CollapseTransition from "@ivanv/vue-collapse-transition/src/CollapseTransition.vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import FCheckbox from "@/components/Form/FCheckbox.vue";
import CTabLang from "@/components/Tab/CTabLang.vue";
import { tabListLanguage } from "@/modules/Courses/data.ts";
interface Props {
  lesson: {
    id: number;
    title: string;
    name: string;
    name_uz: string;
    name_ru: string;
    name_en: string;
    ball: number;
    video: string;
    video_uz: string;
    video_ru: string;
    video_en: string;
    extraFiles: boolean;
    description: string;
    description_uz: string;
    description_ru: string;
    description_en: string;
    files: any[];
    is_open?: boolean;
  };
}

const props = defineProps<Props>();
const { lesson } = unref(props);
const nameValue = ref<string>("uz");
// const empty = ref(false);

// const noVideo = !inject<boolean>("hasVideo");
const rules = {
  name_uz: { required },
  name_ru: { required },
  name_en: { required },
  video_uz: { required },
  video_ru: { required },
  video_en: { required },
  description_uz: { required },
  description_ru: { required },
  description_en: { required },
  ball: { required },
};
const v$ = useVuelidate(rules, lesson);

defineExpose({ v$, lesson });
</script>
