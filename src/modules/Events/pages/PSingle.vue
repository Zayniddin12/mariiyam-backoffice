<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div>
    <CCommonHeader
      class="mb-6"
      :title="eventData?.title"
      no-tabs
      no-image
      no-hr
      :sub-title="eventData?.description"
    >
      <template #details>
        <CProfileDashDetail
          :title="dayjs(eventData?.event_date).format('D MMMM, YYYY, HH:mm')"
          :description="$t('date_conducted') + ':'"
        />
        <CProfileDashDetail :description="$t('event_status')">
          <CEventStatusBadge :status="eventData?.status" />
        </CProfileDashDetail>
        <CProfileDashDetail
          :title="formatMoneyDecimal(eventData?.visitors_max)"
          :description="$t('prediction_visitors')"
        />
        <CProfileDashDetail
          :title="formatMoneyDecimal(eventData?.visitors)"
          :description="$t('come_visitors')"
        />
      </template>
    </CCommonHeader>

    <section class="px-5 pt-5 bg-white rounded-2xl">
      <CTableWrapper
        :head="headData"
        :data="eventsDataSingle"
        :items-per-page="10"
        :limit="10"
        :total="222"
        :current-page="1"
        :title="$t('students_come')"
        :subtitle="$t('students_come_count', { count: 222 })"
      >
        <template #_index="{ row: data }">
          <p class="font-semibold">{{ data?._index }}.</p>
        </template>
        <template #name="{ row: data }">
          <CUserCard :card="data?.user" />
        </template>
        <template #flow="{ row: data }">
          <div>
            <p class="text-sm leading-normal font-medium text-dark-100">
              {{ data?.flow?.title }}
            </p>
            <p class="text-xs leading-normal font-normal text-gray-700 mt-0.5">
              {{ data?.flow?.type }}
            </p>
          </div>
        </template>
        <template #date="{ row: data }">
          <div v-if="data?.is_visited">
            <p
              class="text-xs leading-normal font-medium text-blueDark flex-y-center gap-1"
            >
              <i class="icon-tick-circle text-base" />
              {{ $t("visited") }}
            </p>
            <p class="mt-1 text-xs leading-normal font-normal text-dark-100">
              {{ dayjs(data?.visited_date).format("D MMMM YYYY, HH:mm") }}
            </p>
          </div>
          <div v-else>
            <p
              class="text-xs leading-normal font-medium text-gray flex-y-center gap-1"
            >
              <i class="icon-forbidden text-base" />
              {{ $t("not_visited") }}
            </p>
            <p class="mt-1 text-xs leading-normal font-normal text-dark-100">
              -
            </p>
          </div>
        </template>
        <template #actions>
          <CDropdown>
            <template #head>
              <div
                class="h-7 w-7 nr-5 flex items-center justify-center gap-2.5 rounded-md bg-gray-100 group hover:bg-gray-800 focus:bg-gray-800 cursor-pointer"
              >
                <i
                  class="icon icon-more text-dark-100 group-hover:text-blueDark"
                ></i>
              </div>
            </template>

            <template #default>
              <div class="flex flex-col bg-white rounded-lg shadow-dropdown">
                <div
                  class="min-w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300 transition-300"
                >
                  <i class="icon-tick-circle text-blueDark text-xl"></i>
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                    >{{ $t("mark_as_visited") }}</span
                  >
                </div>
              </div>
            </template>
          </CDropdown>
        </template>

        <!--    Actions    -->
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
</template>

<script setup lang="ts">
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import { eventData, eventsDataSingle } from "@/modules/Events/data";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import dayjs from "dayjs";
import CEventStatusBadge from "@/modules/Events/components/CEventStatusBadge.vue";
import { formatMoneyDecimal } from "@/utils";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import CUserCard from "@/components/Card/CUserCard.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import { computed } from "vue";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";

const { t } = useI18n();
const { mounted } = useMounted();

const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("events"),
    route: "/events",
  },
  {
    name: "Single",
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
    title: "name_student",
    key: "name",
  },
  {
    title: "flow_group",
    key: "flow",
  },
  {
    title: "date_entrance",
    key: "date",
  },
  {
    title: "actions",
    key: "actions",
  },
];
</script>
