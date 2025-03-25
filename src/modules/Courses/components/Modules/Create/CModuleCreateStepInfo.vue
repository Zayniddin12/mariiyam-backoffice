<template>
  <CCard class="w-full p-5">
    <p class="text-xl leading-130 font-semibold text-dark-100">
      {{ $t("general_information_about_group") }}
    </p>
    <div class="mt-5">
      <label for="" class="text-dark-100 text-sm">
        {{ $t("upload_photo") }}
        <span class="text-gray text-xs">
          {{ $t("upload_max_limit", { limit: "15мб" }) }}
        </span>
      </label>
      <ImageUploader
        class="mt-2"
        icon="icon-file-fill !text-[40px]"
        wrapper-class="flex-col"
        title="drag_photo_here"
        :default-image="values.image"
        :error="form.$v.value.image.$error"
        @change="values.image = $event"
      >
        <template #subtitle>
          <i18n-t
            keypath="drag_photo_or"
            tag="p"
            class="text-xs leading-130 font-normal text-gray"
          >
            <template #choose>
              <span class="text-blueDark">
                {{ $t("choose_file") }}
              </span>
            </template>
          </i18n-t>
        </template>
      </ImageUploader>
    </div>
    <div class="w-full h-px bg-gray-900 my-4" />
    <div class="gap-4 mt-2.5">
      <CTabLang v-model="nameValue" :list="tabListLanguage" withIcon />
      <FGroup
        v-if="nameValue === 'uz'"
        :label="$t('module_name_uz')"
        class="mt-1"
      >
        <FInput
          v-model="values.name_uz"
          :error="form.$v.value.name_uz.$error"
          :placeholder="$t('think_about_group_name_uz')"
        />
      </FGroup>
      <FGroup
        v-if="nameValue === 'ru'"
        :label="$t('module_name_ru')"
        class="mt-1"
      >
        <FInput
          v-model="values.name_ru"
          :error="form.$v.value.name_ru.$error"
          :placeholder="$t('think_about_group_name')"
        />
      </FGroup>
      <FGroup
        v-if="nameValue === 'en'"
        :label="$t('module_name_en')"
        class="mt-1"
      >
        <FInput
          v-model="values.name_en"
          :error="form.$v.value.name_en.$error"
          :placeholder="$t('think_about_group_name_en')"
        />
      </FGroup>
      <div class="w-full h-px bg-gray-900 my-4" />
      <div class="">
        <FGroup :label="$t('duration')" wrapper-class="!justify-start gap-1">
          <FInput
            v-model="values.days"
            :error="form.$v.value.days.$error"
            placeholder="0"
            v-maska="'###'"
            class="max-w-[170px]"
          />
          <template #labelOpposite>
            <p class="text-xs leading-normal font-normal text-gray">
              {{ $t("in_days") }}
            </p>
          </template>
        </FGroup>
      </div>
    </div>

    <div class="mt-8 flex-center-between">
      <CButton
        class="min-w-[190px]"
        variant="info"
        @click="$emit('back')"
        :text="$t('cancel')"
      />
      <CButton
        class="min-w-[190px]"
        icon="icon-arrow-right"
        :text="$t('next_continue')"
        @click="submit"
        :loading="buttonLoading"
      />
    </div>
  </CCard>
</template>

<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import { TForm } from "@/composables/useForm";
import { ref, unref } from "vue";
import CButton from "@/components/Common/CButton.vue";
import ImageUploader from "@/components/Form/Uploader/ImageUploader.vue";
import CTabLang from "@/components/Tab/CTabLang.vue";
import { tabListLanguage } from "@/modules/Courses/data.ts";

interface Props {
  form: TForm<any>;
}

const props = defineProps<Props>();
const emit = defineEmits(["next", "back"]);

const buttonLoading = ref(false);
const nameValue = ref<string>("uz");

const { form } = unref(props);
const { values } = form;

function submit() {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    emit("next");
  }
}
</script>
