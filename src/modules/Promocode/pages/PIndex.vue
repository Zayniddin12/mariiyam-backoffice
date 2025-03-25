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
        :title="t('promocode')"
        :subtitle="t('promocods_count', { count: paginationData?.total })"
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
            class="shrink-0"
            icon="icon-add"
            icon-position="left"
            :text="$t('add')"
            @click="$router.push({ name: 'PromocodeCreate' })"
          />
        </template>
        <template #_index="{ row: data }">
          <span
            class="text-sm text-dark-100 font-semibold leading-normal"
            v-text="data._index + '.'"
          />
        </template>
        <template #name="{ row: data }">
          <div class="flex flex-col space-y-1">
            <RouterLink
              :to="{
                name: 'PromocodeSingle',
                params: { promocodeId: data.id },
              }"
              class="text-sm font-medium"
              >{{ data.title }}</RouterLink
            >
            <button
              @click="copyToClipboard(data?.code)"
              class="flex flex-row space-x-1 cursor-pointer"
            >
              <span class="text-yellow-200 text-xs font-medium"
                >{{ data?.code }}
              </span>
              <i class="icon-copy text-xs text-[#F9A82F]"></i>
            </button>
          </div>
        </template>
        <template #lessons="{ row: data }">
          <div class="text-xs font-normal flex flex-col">
            <p>{{ dayjs(data?.end_date).format("D MMMM YYYY") }}</p>
            <p class="text-[#AAB9BD]">
              {{ dayjs(data?.end_date).format("h:mm") }}
            </p>
          </div>
        </template>
        <template #status="{ row: data }">
          <div
            v-if="data.status === 'Expired'"
            class="flex flex-row items-center space-x-1 text-[#4D86F8]"
          >
            <i class="icon-calendar1 text-base"></i>
            <p class="text-xs font-medium">
              {{ $t("promocode_status.expired") }}
            </p>
          </div>
          <div
            v-if="data.status === 'Not_left'"
            class="flex flex-row items-center space-x-1 text-[#E04A36]"
          >
            <i class="icon-close-circle text-base"></i>
            <p class="text-xs font-medium">
              {{ $t("promocode_status.none_left") }}
            </p>
          </div>

          <div
            v-if="data.status === 'Active'"
            class="flex flex-row items-center space-x-1 text-green"
          >
            <i class="icon-tick-circle text-base"></i>
            <p class="text-xs font-medium">
              {{ $t("promocode_status.active") }}
            </p>
          </div>
        </template>

        <template #number_of_users="{ row: data }">
          <p class="text-xs text-[#AAB9BD]">
            <span class="inline-block text-[#03151A] font-medium">{{
              data?.usage
            }}</span>
            /
            {{ data?.total_users }}
          </p>
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
                  class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300 transition-300"
                  @click="
                    $router.push({
                      name: 'CourseEdit',
                      params: { id: data?.id },
                    })
                  "
                >
                  <i class="icon-edit text-gray text-xl"></i>
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                    >{{ $t("edit") }}</span
                  >
                </div>
                <hr class="w-full h-[1px] bg-gray-300" />
                <div
                  class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-red-100 transition-300"
                  @click="
                    showDelete = true;
                    selectedCourse = data?.id;
                  "
                >
                  <i class="icon-trash text-red text-xl"></i>
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                    >{{ $t("table.dropdown.remove") }}</span
                  >
                </div>
              </div>
            </template>
          </CDropdown>
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

const { t } = useI18n();
const { mounted } = useMounted();
const { showToast } = useCustomToast();

const {
  tableData,
  paginationData,
  onSearch,
  loading,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch<IPromocode>(`/backoffice/promo-code/list/`);

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
      title: "name_promocode",
      key: "name",
    },
    {
      title: "end_date_promocode",
      key: "lessons",
    },
    {
      title: "status",
      key: "status",
    },
    {
      title: "number_of_users",
      key: "number_of_users",
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
