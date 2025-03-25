<template>
  <div class="grid grid-cols-12 gap-6 mt-6">
    <CCard class="p-6 2xl:col-span-9 col-span-8">
      <form>
        <h3 class="text-dark-100 text-xl font-semibold">
          {{ $t("general_information") }}
        </h3>
        <FGroup :label="$t('name')" class="mt-4">
          <FInput
            :placeholder="$t('enter_title')"
            v-model="values.title"
            :error="form.$v.value.title.$error"
            @change="form.$v.value.title?.$touch()"
          />
        </FGroup>

        <FGroup
          :label="$t('promocode_create_form.promoCodeInLatin')"
          class="mt-4"
        >
          <FInput
            :placeholder="$t('promocode_create_form.enterPromoCode')"
            v-model="values.code"
            :error="form.$v.value.amount.$error"
          />
        </FGroup>

        <FGroup :label="$t('promocode_create_form.discountInSum')" class="mt-4">
          <FInput
            v-maska="moneyMask"
            :placeholder="$t('promocode_create_form.enterDiscountPrice')"
            v-model="values.amount"
            :error="form.$v.value.amount.$error"
          />
        </FGroup>

        <div class="flex flex-row items-center mt-4 space-x-4">
          <FGroup :label="$t('promocode_create_form.startDate')">
            <FDatePicker
              :placeholder="$t('promocode_create_form.selectDate')"
              v-model="values.start_date"
              :error="form.$v.value.start_date.$error"
            />
          </FGroup>

          <FGroup :label="$t('promocode_create_form.endDate')">
            <FDatePicker
              :placeholder="$t('promocode_create_form.selectDate')"
              v-model="values.end_date"
              :error="form.$v.value.end_date.$error"
              :min-date="new Date(formatDateRightOrder(values.start_date))"
              :disabled="values.start_date === ''"
            />
          </FGroup>
        </div>

        <FGroup :label="$t('promocode_create_form.quantityLimit')" class="mt-4">
          <FInput
            v-maska="moneyMask"
            :placeholder="$t('promocode_create_form.quantity')"
            v-model="values.usage"
            :error="form.$v.value.usage.$error"
          />
        </FGroup>
      </form>
    </CCard>
  </div>
</template>
<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import ImageUploader from "@/components/Form/Uploader/ImageUploader.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import FTextarea from "@/components/Form/FTextarea.vue";
import { TForm } from "@/composables/useForm";
import { unref, watch } from "vue";
import FDatePicker from "@/components/Form/Date/FDatePicker.vue";
import { formatDateRightOrder, moneyMask } from "@/utils";
interface Props {
  form: TForm<any>;
  loading?: boolean;
}
const props = defineProps<Props>();

const { values, $v } = unref(props.form);

const checkValidity = (newVal) => {
  if (
    new Date(formatDateRightOrder(newVal)).getTime() >
    new Date(formatDateRightOrder(values.end_date)).getTime()
  ) {
    values.end_date = "";
  }
};

watch(
  () => values.start_date,
  (newVal) => {
    checkValidity(newVal);
  }
);
</script>
