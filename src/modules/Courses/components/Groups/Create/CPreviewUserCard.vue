<template>
  <div class="flex-center-between px-3 py-2 border rounded-lg border-gray-800">
    <div class="flex-y-center gap-3">
      <CAvatar class="!w-9 !h-9" :image="option?.avatar" />
      <div>
        <p class="text-sm leading-130 font-medium text-dark-100">
          {{ option?.full_name }}
        </p>

        <div class="flex flex-row space-x-1">
          <p
            v-if="!noRole"
            class="mt-1 text-sm leading-130 font-normal text-gray"
          >
            {{ $t(option?.role) }} |
          </p>

          <p
            v-if="option?.phone_number"
            class="mt-1 text-sm leading-130 font-normal text-gray"
          >
            {{ option?.phone_number }}
          </p>
        </div>
      </div>
    </div>
    <button
      v-if="!noClose"
      class="w-8 h-8 rounded-full border border-gray shrink-0 flex-center group hover:border-red transition-300"
      @click="$emit('remove')"
    >
      <i
        class="icon-close text-sm text-gray font-bold group-hover:text-red transition-300"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import CAvatar from "@/components/CAvatar.vue";
import { IWorker } from "@/modules/Courses/types";
import { IStudent } from "@/modules/Students/types";

interface Props {
  option: any;
  noRole?: boolean;
  noClose?: boolean;
}

defineProps<Props>();
</script>
