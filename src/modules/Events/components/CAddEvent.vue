<template>
  <CDialog
    v-bind="{ show }"
    body-class="!max-w-[420px]"
    :title="$t('new_event')"
  >
    <div class="p-5">
      <div class="flex flex-col gap-4">
        <FGroup :label="$t('event_name')">
          <FInput :placeholder="$t('enter_name')" />
        </FGroup>
        <FGroup :label="$t('date_conducted')">
          <FDatePicker v-model="date" />
        </FGroup>
        <FGroup :label="$t('choose_course_label')">
          <CChooseCourse />
        </FGroup>
        <FGroup :label="$t('participating_threads')">
          <CDropdown>
            <template #head>
              <FInput
                :placeholder="$t('choose_group')"
                input-class="!font-medium"
              >
                <template #prefix>
                  <span
                    class="icon-search-normal text-gray text-xl mr-2"
                  ></span>
                </template>
              </FInput>
            </template>
            <div
              class="flex-center-between gap-3 py-2 px-3 border-b border-gray-800 hover:bg-blueDark-100 transition-300"
              v-for="(option, index) in tableData"
              :key="index"
            >
              <p class="text-sm leading-130 font-medium text-dark-100">
                {{ option?.name?.name }}
              </p>
              <CButton :text="$t('add')" />
            </div>
          </CDropdown>
        </FGroup>
      </div>
      <div class="flex flex-col gap-1 mt-2">
        <div
          class="flex-center-between gap-3 p-1.5 pl-3 rounded-lg bg-gray-100 hover:bg-blueDark-100 transition-300"
          v-for="option in tableData"
          :key="option.id"
        >
          <p class="text-xs leading-130 font-medium text-dark-100">
            {{ option?.name?.name }}
          </p>
          <button
            class="w-4 h-4 rounded-full bg-gray-700/20 flex-center group hover:bg-blueDark/20 transition-300"
          >
            <i
              class="icon-close-1 text-[10px] font-semibold text-gray-700 group-hover:text-blueDark transition-300"
            />
          </button>
        </div>
      </div>

      <div class="flex-y-center gap-3 mt-5">
        <CButton
          class="w-full"
          variant="info"
          :text="$t('cancel')"
          @click="$emit('close')"
        />
        <CButton class="w-full" :text="$t('add')" @click="$emit('close')" />
      </div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import FDatePicker from "@/components/Form/Date/FDatePicker.vue";
import { ref } from "vue";
import CChooseCourse from "@/modules/Events/components/CChooseCourse.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import { tableData } from "@/modules/Courses/data";
import CButton from "@/components/Common/CButton.vue";

interface Props {
  show?: boolean;
}

defineProps<Props>();

const date = ref("");
</script>
