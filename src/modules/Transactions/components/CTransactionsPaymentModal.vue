<template>
  <CDialog
    :show="show"
    body-class="!max-w-[381px]"
    :title="$t('check')"
    @close="$emit('close')"
  >
    <CCard class="p-5 pt-1.5">
      <CCheckWrapper class="!mb-0">
        <template #info>
          <div class="flex flex-col space-y-2">
            <div class="flex flex-row justify-between items-start space-x-2">
              <p class="text-[#94A8AA] text-base font-normal">
                {{ $t("transactionDate") }}:
              </p>
              <p class="text-[#061018] text-base font-semibold text-right">
                {{ dayjs(paymentSingle?.paid_at).format("h:mm") }},
                {{ dayjs(paymentSingle?.paid_at).format("DD.MM.YYYY") }}
              </p>
            </div>
            <div class="flex flex-row justify-between items-start space-x-2">
              <p class="text-[#94A8AA] text-base font-normal">
                {{ $t("course_payment") }}:
              </p>
              <p class="text-[#061018] text-base font-semibold text-right">
                {{ paymentSingle?.course.title }}
              </p>
            </div>
            <div class="flex flex-row justify-between items-start space-x-2">
              <p class="text-[#94A8AA] text-base font-normal">
                {{ $t("transactionMethod") }}:
              </p>
              <p class="text-[#061018] text-base font-semibold text-right">
                {{ paymentSingle?.provider }}
              </p>
            </div>
            <div class="flex flex-row justify-between items-start space-x-2">
              <p class="text-[#94A8AA] text-base font-normal text-nowrap">
                {{ $t("transactionId") }}
              </p>
              <p class="text-[#061018] text-base font-semibold text-right">
                {{ paymentSingle?.transaction_id }}
              </p>
            </div>

            <div class="w-full h-[1px] bg-[#EDF0F2]" />

            <div class="flex flex-row justify-between items-start">
              <p class="text-[#94A8AA] text-base font-normal">
                {{ $t("amount") }}:
              </p>
              <p class="text-[#061018] text-base font-semibold text-right">
                {{ paymentSingle?.amount }} UZS
              </p>
            </div>
          </div>
        </template>

        <template #paid>
          <div class="flex justify-between items-center">
            <span class="font-semibold text-[#667779]">{{ $t("paid") }}:</span>
            <span class="text-2xl font-semibold">
              {{ paymentSingle?.amount }} UZS
            </span>
          </div>
        </template>
      </CCheckWrapper>
      <button
        @click="emit('close')"
        class="bg-[#02BFDF] w-full py-2 px-4 text-white text-xs font-semibold rounded-[6px] mt-5"
      >
        {{ $t("close") }}
      </button>
    </CCard>
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import dayjs from "dayjs";
import CCheckWrapper from "@/components/CCheckWrapper.vue";
import CCard from "@/components/Card/CCard.vue";

interface Props {
  show: boolean;
  paymentSingle: any;
}

const props = defineProps<Props>();
const emit = defineEmits(["close"]);
</script>
