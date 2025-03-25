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
        :tr-class="{
          'animate-bg': $route.query.course,
        }"
        @search="onSearch"
        :loading="loading"
        @itemsPerPage="onChangeLimit"
        @pageChange="onPageChange"
      >
        <template #header_title>
          <div class="flex flex-row space-x-7">
            <div class="flex flex-col">
              <p class="text-sm font-medium">{{ singleData?.title }}</p>
              <button
                @click="copyToClipboard(singleData?.code)"
                class="flex flex-row space-x-1 cursor-pointer"
              >
                <span class="text-yellow-200 text-xs font-medium"
                  >{{ singleData?.code }}
                </span>
                <i class="icon-copy text-xs text-yellow-200"></i>
              </button>
            </div>

            <div
              v-if="singleData?.status === 'Expired'"
              class="flex flex-col space-y-1"
            >
              <p class="text-[#AAB9BD] text-xs">Статус</p>
              <div class="flex flex-row items-center space-x-1 text-[#4D86F8]">
                <i class="icon-calendar1 text-base"></i>
                <p class="text-xs font-medium">
                  {{ $t("promocode_status.expired") }}
                </p>
              </div>
            </div>

            <div
              v-if="singleData?.status === 'Not_left'"
              class="flex flex-col space-y-1"
            >
              <p class="text-[#AAB9BD] text-xs">Статус</p>

              <div
                v-if="singleData?.status === 'Not_left'"
                class="flex flex-row items-center space-x-1 text-[#E04A36]"
              >
                <i class="icon-close-circle text-base"></i>
                <p class="text-xs font-medium">
                  {{ $t("promocode_status.none_left") }}
                </p>
              </div>
            </div>

            <div
              v-if="singleData?.status === 'Active'"
              class="flex flex-col space-y-1"
            >
              <p class="text-[#AAB9BD] text-xs">Статус</p>
              <div class="flex flex-row items-center space-x-1 text-[#36C27F]">
                <i class="icon-tick-circle text-base"></i>
                <p class="text-xs font-medium">
                  {{ $t("promocode_status.active") }}
                </p>
              </div>
            </div>

            <div class="flex flex-col space-y-1">
              <p class="text-[#AAB9BD] text-xs">До окончания</p>
              <p class="text-xs font-normal">
                {{ dayjs(singleData?.end_date).format("D MMMM YYYY") }}
              </p>
            </div>

            <div class="flex flex-col space-y-1">
              <p class="text-[#AAB9BD] text-xs">Кол-во использовании</p>
              <p class="text-xs text-[#AAB9BD]">
                <span class="inline-block text-[#03151A] font-medium">{{
                  singleData?.total_used
                }}</span>
                /
                {{ singleData?.usage }}
              </p>
            </div>
          </div>
        </template>

        <template #afterSearch>
          <CButton
            class="shrink-0"
            icon="icon-add"
            icon-position="left"
            :text="$t('edit')"
            @click="
              $router.push({
                name: 'PromocodeEdit',
                params: { promocodeId: singleData.id },
              })
            "
          />
        </template>
        <template #_index="{ row: data }">
          <span
            class="text-sm text-dark-100 font-semibold leading-normal"
            v-text="data._index + '.'"
          />
        </template>
        <template #student_name="{ row: data }">
          <p class="text-sm font-medium">{{ data?.student?.full_name }}</p>
        </template>

        <template #course="{ row: data }">
          <div class="flex flex-row space-x-1 items-center">
            <img
              :src="`${data?.course?.photo}`"
              alt="no image"
              class="size-10 rounded-md"
            />
            <p class="text-xs font-normal">{{ data?.course?.title }}</p>
          </div>
        </template>

        <template #amount_course="{ row: data }">
          <p class="text-xs font-medium">{{ data?.orginal_price }} UZS</p>
        </template>

        <template #amount_with_promocode="{ row: data }">
          <p class="text-xs font-medium">{{ data?.amount }} UZS</p>
        </template>

        <template #no-data>
          <CNodata
            :title="$t('no_courses')"
            :subtitle="$t('no_courses_text')"
          />
        </template>
      </CTableWrapper>
    </section>
  </div>
  <CDeleteCourse
    :show="showDelete"
    :user-role="userRole"
    @close="showDelete = false"
    @submit="fetchTableData"
    :id="selectedCourse"
  />
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import dayjs from "dayjs";
import CCourseCard from "@/modules/Students/components/CCourseCard.vue";
import CButton from "@/components/Common/CButton.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { copyToClipboard, secondsToTime, updateQueryParams } from "@/utils";
import CNodata from "@/components/Common/CNodata.vue";
import CDeleteCourse from "@/modules/Courses/components/Delete/CDeleteCourse.vue";
import { useAuthStore } from "@/modules/Auth/stores";
import { IPromocode } from "@/modules/Promocode/types";
import { useCustomToast } from "@/composables/useCustomToast";
import { useRoute } from "vue-router";

const { t } = useI18n();
const { mounted } = useMounted();
const { showToast } = useCustomToast();
const route = useRoute();

const {
  tableData,
  paginationData,
  onSearch,
  loading,
  onPageChange,
  onChangeLimit,
  fetchTableData,
  singleData,
} = useTableFetch<IPromocode>(
  `/study/promo-code/use-history/${route.params?.promocodeId}/`,
  {},
  false
);

const showDelete = ref(false);
const selectedCourse = ref(null);

const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("promocode"),
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

const headData = computed(() => {
  let data = [
    {
      title: "table.head.title1",
      key: "_index",
    },
    {
      title: "student_name",
      key: "student_name",
    },
    {
      title: "course",
      key: "course",
    },
    {
      title: "amount_course",
      key: "amount_course",
    },
    {
      title: "amount_with_promocode",
      key: "amount_with_promocode",
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
