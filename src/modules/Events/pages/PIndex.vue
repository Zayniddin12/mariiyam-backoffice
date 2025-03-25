<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div>
    <section class="px-5 pt-5 bg-white rounded-2xl">
      <CTableWrapper
        :head="headData"
        :data="eventsData"
        :items-per-page="10"
        :limit="10"
        :total="222"
        :current-page="1"
        :title="t('events')"
        :subtitle="t('events_count', { count: 222 })"
      >
        <template #_index="{ row: data }">
          <p class="font-semibold">{{ data?._index }}.</p>
        </template>
        <template #name="{ row: data }">
          <RouterLink
            :to="{ name: 'EventSingle', params: { id: data?.id } }"
            class="text-sm font-medium leading-normal hover:text-blueDark transition-300"
            >{{ data?.title }}</RouterLink
          >
        </template>
        <template #course="{ row: data }">
          <div class="flex-y-center gap-2">
            <CAvatar
              :image="data?.course?.image"
              class="!w-[30px] !h-[30px] rounded-lg"
            />
            <p class="text-xs leading-normal font-normal text-dark-100">
              {{ data?.course?.title }}
            </p>
          </div>
        </template>
        <template #status="{ row: data }">
          <CEventStatusBadge :status="data?.status" />
        </template>
        <template #date="{ row: data }">
          <p>{{ dayjs(data?.event_date).format("D MMMM, YYYY") }}</p>
        </template>
        <template #visit="{ row: data }">
          <p class="text-xs leading-130 font-normal text-gray text-right">
            <span class="font-medium text-dark-100">{{ data?.visitors }}</span>
            / {{ data?.visitors_max }}
          </p>
        </template>
        <template #beforeSearch>
          <div class="flex-y-center gap-5">
            <FSelect
              v-bind="{ options }"
              selected-option-styles="bg-white !border-gray-800 rounded-md "
              value-key="value"
              label-key="label"
              class="min-w-[160px]"
            />
            <FSelect
              v-bind="{ options }"
              selected-option-styles="bg-white !border-gray-800 rounded-md "
              value-key="value"
              label-key="label"
              class="min-w-[160px]"
            />
          </div>
        </template>
        <template #afterSearch>
          <CButton
            :text="$t('add')"
            icon="icon-add"
            icon-position="left"
            class="!h-10 flex-center"
            @click="showAdd = true"
          />
        </template>

        <template #no-data>
          <div class="py-[128px] flex-center">
            <div class="text-center">
              <img
                src="/images/svg/no-data/no-events.svg"
                alt="no-events"
                class="mx-auto"
              />
              <p class="text-base leading-130 font-semibold text-dark-100 mt-6">
                {{ $t("no_events_yet") }}
              </p>
              <p class="mt-1.5 text-sm leading-130 font-normal text-gray">
                {{ $t("no_events_yet_text") }}
              </p>
            </div>
          </div>
        </template>
      </CTableWrapper>
    </section>
  </div>
  <CAddEvent :show="showAdd" @close="showAdd = false" />
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";

import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CAvatar from "@/components/CAvatar.vue";
import dayjs from "dayjs";
import CButton from "@/components/Common/CButton.vue";
import CEventStatusBadge from "@/modules/Events/components/CEventStatusBadge.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import { eventsData } from "@/modules/Events/data";
import CAddEvent from "@/modules/Events/components/CAddEvent.vue";

const { t } = useI18n();
const { mounted } = useMounted();

const showAdd = ref(false);

const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("events"),
    route: "/",
  },
]);

const options = [
  {
    label: "Label 1",
    value: "value 1",
  },
  {
    label: "Label 2",
    value: "value 2",
  },
  {
    label: "Label 3",
    value: "value 3",
  },
];

const headData = [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "event_name",
    key: "name",
  },
  {
    title: "course",
    key: "course",
  },
  {
    title: "status",
    key: "status",
  },
  {
    title: "event_date",
    key: "date",
  },
  {
    title: "visit",
    key: "visit",
  },
];
</script>
