<template>
  <CCard class="p-6">
    <p class="text-xl leading-normal font-semibold text-dark-100">
      {{ $t("general_information") }}
    </p>

    <div class="mt-4 flex flex-col gap-4">
      <CTabLang v-model="nameValue" :list="tabListLanguage" withIcon />
      <FGroup v-if="nameValue === 'uz'" :label="$t('title_uz')">
        <FInput :placeholder="$t('enter_title_uz')" v-model="values.title_uz" />
      </FGroup>
      <FGroup v-if="nameValue === 'ru'" :label="$t('title_ru')">
        <FInput :placeholder="$t('enter_title_ru')" v-model="values.title_ru" />
      </FGroup>
      <FGroup v-if="nameValue === 'en'" :label="$t('title_en')">
        <FInput :placeholder="$t('enter_title_en')" v-model="values.title_en" />
      </FGroup>

      <FGroup
        v-if="nameValue === 'uz'"
        :label="$t('assignment_description_uz')"
      >
        <FTextarea
          :placeholder="$t('enter_assignment_description_uz')"
          textarea-class="h-[120px]"
          maxlength="3000"
          v-model="values.description_uz"
        />
      </FGroup>
      <FGroup
        v-if="nameValue === 'ru'"
        :label="$t('assignment_description_ru')"
      >
        <FTextarea
          :placeholder="$t('enter_assignment_description_ru')"
          textarea-class="h-[120px]"
          maxlength="3000"
          v-model="values.description_ru"
        />
      </FGroup>
      <FGroup
        v-if="nameValue === 'en'"
        :label="$t('assignment_description_en')"
      >
        <FTextarea
          :placeholder="$t('enter_assignment_description_en')"
          textarea-class="h-[120px]"
          maxlength="3000"
          v-model="values.description_en"
        />
      </FGroup>

      <div class="mt-4 grid grid-cols-2 gap-4">
        <FGroup :label="$t('allotted_point')">
          <FInput
            placeholder="0"
            v-maska="'###'"
            v-model="values.ball"
            :error="form.$v.value.ball.$error"
          />
        </FGroup>
        <FGroup :label="$t('add_day')">
          <FInput
            placeholder="0"
            v-maska="'####'"
            v-model="values.duration_days"
            :error="form.$v.value?.duration_days?.$error"
          />
        </FGroup>
        <FGroup v-if="isTest" :label="$t('allotted_time')">
          <FInput
            :placeholder="$t('0_min')"
            v-maska="'####'"
            v-model="values.allocated_time"
            :error="form.$v.value?.allocated_time?.$error"
          />
        </FGroup>
      </div>
    </div>
  </CCard>
</template>

<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import FTextarea from "@/components/Form/FTextarea.vue";
import { ref, unref } from "vue";
import { TForm } from "@/composables/useForm";
import { tabListLanguage } from "@/modules/Courses/data.ts";
import CTabLang from "@/components/Tab/CTabLang.vue";

interface Props {
  isTest: boolean;
  form: TForm<any>;
}

const props = defineProps<Props>();
const { form } = unref(props);
const { values } = form;

const nameValue = ref<string>("uz");

const text = ref("");
</script>
