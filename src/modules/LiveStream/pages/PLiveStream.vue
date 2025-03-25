<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div>
    <section class="px-5 pt-5 bg-white rounded-2xl">
      <CTableWrapper
        :head="headData"
        :data="tableData"
        :items-per-page="paginationData?.defaultLimit"
        :limit="paginationData?.defaultLimit"
        :total="paginationData?.total"
        :current-page="paginationData?.currentPage"
        :title="t('online_streams')"
        :subtitle="t('streams_count', { count: paginationData?.total })"
        :tr-class="{
          'animate-bg': $route.query.course,
        }"
        @search="onSearch"
        :loading="loading"
        @itemsPerPage="onChangeLimit"
        @pageChange="onPageChange"
      >
        <template #afterSearch>
          <CButton
            v-if="grandAccess(userRole ?? '')"
            class="shrink-0"
            icon="icon-add"
            icon-position="left"
            :text="$t('add_course')"
            @click="$router.push({ name: 'LiveStreamCreate' })"
          />
        </template>
        <template #_index="{ row: data }">
          <span
            class="text-sm text-dark-100 font-semibold leading-normal"
            v-text="data._index + '.'"
          />
        </template>
        <template #name="{ row: data }">
          <div>
            <p
              class="text-sm leading-130 font-medium text-dark-100 transition-300 hover:!text-blueDark line-clamp-2"
            >
              <Highlighter
                class="text-sm leading-130 text-dark transition-300"
                highlight-class-name="bg-[#FFCD55] rounded p-0.5"
                :search-words="[$route.query?.search ?? '']"
                :text-to-highlight="data?.title"
              />
            </p>
            <a
              class="text-green font-medium leading-130 text-xs flex items-center gap-1 transition-300 mt-1"
              :href="data?.youtube_url"
              target="_blank"
            >
              {{ $t("go") }}
              <i class="icon-export text-green" />
            </a>
          </div>
        </template>
        <template #created_at="{ row: data }">
          <div>
            <p class="text-dark font-medium">
              {{ dayjs(data?.scheduled_time).format("D MMMM YYYY") }}
            </p>
            <p class="text-[#AAB9BD]">
              {{ dayjs(data?.scheduled_time).format("HH:mm") }}
            </p>
          </div>
        </template>
        <template #end_date="{ row: data }">
          <p v-if="data?.end_date" class="text-dark font-medium">
            {{ dayjs(data?.end_date).format("D MMMM YYYY") }}
          </p>
        </template>
        <template #module="{ row: data }">
          <div class="text-sm font-medium">
            <p
              v-if="data?.status === 'completed'"
              class="text-green flex items-center gap-1"
            >
              <img src="/images/svg/completed.svg" alt="image" />
              {{ $t("completed") }}
            </p>
            <p
              v-else-if="data?.status === 'ongoing'"
              class="text-yellow-200 flex items-center gap-1"
            >
              <img src="/images/svg/proses.svg" alt="image" />
              {{ $t("prosess") }}
            </p>
            <p
              v-else-if="data?.status === 'scheduled'"
              class="text-[#4D86F8] flex items-center gap-1"
            >
              <img src="/images/svg/waiting.svg" alt="image" />
              {{ $t("pending") }}
            </p>
            <p class="flex items-center gap-1 text-[#E04A36]" v-else>
              <img src="/images/svg/rejected.svg" alt="image" />
              {{ $t("canceled") }}
            </p>
          </div>
        </template>
        <template #lessons="{ row: data }">
          <div class="flex gap-1 items-center">
            <div v-for="(item, index) in data?.group?.slice(0, 1)" :key="index">
              <p class="text-[#03151A] text-xs line-clamp-1">
                {{ item?.title }}
              </p>
            </div>

            <p
              v-if="getGroupLength(data?.group) > 1"
              class="bg-[#E3E8E9] px-1.5 py-1 text-[#03151A] text-xs rounded whitespace-nowrap"
            >
              {{ $t("more") }}
              {{ getGroupLength(data?.group) }}
            </p>
            <p v-else>0</p>
          </div>
        </template>
        <template #task="{ row: data }">
          <div class="flex items-center gap-1">
            <p>{{ data?.watching }}</p>
            /
            <p class="text-[#AAB9BD]">{{ data?.anticipated_viewer_count }}</p>
          </div>
        </template>
        <template #action="{ row: data }">
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
                  class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-red-100 transition-300"
                  @click="
                    showDelete = true;
                    selectedStream = data?.id;
                  "
                >
                  <i class="icon-trash text-red text-xl"></i>
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                    >{{ $t("endSteam") }}</span
                  >
                </div>
              </div>
            </template>
          </CDropdown>
        </template>
      </CTableWrapper>
    </section>
  </div>
  <CEndLiveStream
    :show="showDelete"
    :user-role="userRole"
    @close="showDelete = false"
    @submit="fetchTableData"
    :id="selectedStream"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import dayjs from "dayjs";
import CButton from "@/components/Common/CButton.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { updateQueryParams } from "@/utils";
import { useAuthStore } from "@/modules/Auth/stores";
import Highlighter from "vue-highlight-words";
import CDropdown from "@/components/Common/CDropdown.vue";
import CDeleteLiveStream from "@/modules/LiveStream/Components/CEndLiveStream.vue";
import CEndLiveStream from "@/modules/LiveStream/Components/CEndLiveStream.vue";

const { t } = useI18n();
const { mounted } = useMounted();

const {
  tableData,
  paginationData,
  onSearch,
  loading,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch(`/study/live-streams/`);

const showDelete = ref(false);
const selectedStream = ref(null);

const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("courses"),
    route: "/",
  },
]);

onMounted(() => {
  setTimeout(() => {
    updateQueryParams("course", undefined);
  }, 4000);
});

const authStore = useAuthStore();

const userRole = computed(() => authStore?.user?.role);

function grandAccess(role: string) {
  return ["admin", "manager"]?.includes(role);
}

const headData = computed(() => {
  let data = [
    {
      title: "table.head.title1",
      key: "_index",
    },
    {
      title: "name_live_stream",
      key: "name",
    },
    {
      title: "date",
      key: "created_at",
    },
    {
      title: "end_date",
      key: "end_date",
    },
    {
      title: "status",
      key: "module",
    },
    {
      title: "for_group",
      key: "lessons",
    },
    {
      title: "number_of_people_watching",
      key: "task",
    },
    {
      title: "action",
      key: "action",
    },
  ];

  if (userRole.value === "mentor") {
    return data.map((item) =>
      item.key === "action"
        ? { title: "", key: "" }
        : { title: item?.title, key: item?.key }
    );
  }

  return data;
});

function getGroupLength(group: any[]) {
  return group?.length;
}
</script>

<style>
.animate-bg:first-child {
  animation: fadeBg 4s ease-in forwards;
}

@keyframes fadeBg {
  0% {
    background-color: #f0fff4;
  }
  100% {
    background-color: #fff;
  }
}
</style>
