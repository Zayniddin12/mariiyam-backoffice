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
        :title="$t('transactionHistory')"
        :subtitle="`${paginationData?.total} ${t('transactionHistories')}`"
        :tr-class="{
          'animate-bg': $route.query.course,
        }"
        @search="onSearch"
        :loading="loading"
        @itemsPerPage="onChangeLimit"
        @pageChange="onPageChange"
      >
        <template #filter>
          <div>
            <div class="flex justify-end mb-5">
              <FDatePicker
                v-model="date"
                range
                class="max-w-[240px] !bg-white w-full"
              />
            </div>
            <div
              v-if="singleData"
              class="bg-[#EDF0F2]/50 mb-6 p-3 rounded-xl flex flex-row w-fit"
            >
              <div class="flex flex-row space-x-2 items-center">
                <CAvatar
                  :image="user.avatar"
                  class="size-9 shrink-0 rounded-full border-2 border-[rgba(6, 16, 24, 0.10)]"
                />
                <div class="flex flex-col">
                  <p class="text-xs font-medium">
                    {{ user?.full_name }}
                  </p>
                  <p class="text-xs font-normal text-[#94A8AA]">
                    {{ user?.phone_number }}
                  </p>
                </div>
              </div>

              <span
                class="w-[1px] block h-full shrink min-h-[45px] flex-1 bg-[#94A8AA]/50 mx-6"
              />

              <div class="flex flex-row space-x-2 items-center">
                <span>
                  <svg
                    width="32"
                    height="33"
                    viewBox="0 0 32 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 28.5H28M4 24.5H28M7.76444 4.50049C8.31773 4.98911 8.66667 5.7038 8.66667 6.5C8.66667 7.97276 7.47276 9.16667 6 9.16667C5.2038 9.16667 4.48911 8.81773 4.00049 8.26444M7.76444 4.50049C7.92192 4.5 8.08901 4.5 8.26667 4.5H23.7333C23.911 4.5 24.0781 4.5 24.2356 4.50049M7.76444 4.50049C6.59803 4.50411 5.9586 4.53457 5.45603 4.79065C4.95426 5.04631 4.54631 5.45426 4.29065 5.95603C4.03457 6.4586 4.00411 7.09803 4.00049 8.26444M4.00049 8.26444C4 8.42192 4 8.58901 4 8.76667V16.2333C4 16.411 4 16.5781 4.00049 16.7356M4.00049 16.7356C4.48911 16.1823 5.2038 15.8333 6 15.8333C7.47276 15.8333 8.66667 17.0272 8.66667 18.5C8.66667 19.2962 8.31773 20.0109 7.76444 20.4995M4.00049 16.7356C4.00411 17.902 4.03457 18.5414 4.29065 19.044C4.54631 19.5457 4.95426 19.9537 5.45603 20.2094C5.9586 20.4654 6.59803 20.4959 7.76444 20.4995M7.76444 20.4995C7.92192 20.5 8.08901 20.5 8.26667 20.5H23.7333C23.911 20.5 24.0781 20.5 24.2356 20.4995M28 16.7361C27.5114 16.1825 26.7965 15.8333 26 15.8333C24.5272 15.8333 23.3333 17.0272 23.3333 18.5C23.3333 19.2962 23.6823 20.0109 24.2356 20.4995M28 16.7361C28.0005 16.5785 28 16.4112 28 16.2333V8.76667C28 8.58901 28 8.42192 27.9995 8.26444M28 16.7361C27.9964 17.9022 27.9654 18.5415 27.7094 19.044C27.4537 19.5457 27.0457 19.9537 26.544 20.2094C26.0414 20.4654 25.402 20.4959 24.2356 20.4995M27.9995 8.26444C27.5109 8.81773 26.7962 9.16667 26 9.16667C24.5272 9.16667 23.3333 7.97276 23.3333 6.5C23.3333 5.7038 23.6823 4.98911 24.2356 4.50049M27.9995 8.26444C27.9959 7.09803 27.9654 6.4586 27.7094 5.95603C27.4537 5.45426 27.0457 5.04631 26.544 4.79065C26.0414 4.53457 25.402 4.50411 24.2356 4.50049M18.6667 12.5C18.6667 13.9728 17.4728 15.1667 16 15.1667C14.5272 15.1667 13.3333 13.9728 13.3333 12.5C13.3333 11.0272 14.5272 9.83333 16 9.83333C17.4728 9.83333 18.6667 11.0272 18.6667 12.5Z"
                      stroke="#02BFDF"
                      stroke-width="2"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <div class="flex flex-col">
                  <p class="text-xs text-[#4D696E] font-normal">
                    {{ $t("courseCount") }}
                  </p>
                  <p class="text-[16px] font-semibold text-[#061018]">
                    {{ singleData?.paid_courses_count }}
                  </p>
                </div>
              </div>

              <span
                class="w-[1px] block h-full shrink min-h-[45px] flex-1 bg-[#94A8AA]/50 mx-6"
              />

              <div class="flex flex-row space-x-2 items-center">
                <span>
                  <svg
                    width="32"
                    height="33"
                    viewBox="0 0 32 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.76444 8.50049C8.31773 8.98911 8.66667 9.7038 8.66667 10.5C8.66667 11.9728 7.47276 13.1667 6 13.1667C5.2038 13.1667 4.48911 12.8177 4.00049 12.2644M7.76444 8.50049C7.92192 8.5 8.08901 8.5 8.26667 8.5H23.7333C23.911 8.5 24.0781 8.5 24.2356 8.50049M7.76444 8.50049C6.59803 8.50411 5.9586 8.53457 5.45603 8.79065C4.95426 9.04631 4.54631 9.45426 4.29065 9.95603C4.03457 10.4586 4.00411 11.098 4.00049 12.2644M4.00049 12.2644C4 12.4219 4 12.589 4 12.7667V20.2333C4 20.411 4 20.5781 4.00049 20.7356M4.00049 20.7356C4.48911 20.1823 5.2038 19.8333 6 19.8333C7.47276 19.8333 8.66667 21.0272 8.66667 22.5C8.66667 23.2962 8.31773 24.0109 7.76444 24.4995M4.00049 20.7356C4.00411 21.902 4.03457 22.5414 4.29065 23.044C4.54631 23.5457 4.95426 23.9537 5.45603 24.2094C5.9586 24.4654 6.59803 24.4959 7.76444 24.4995M7.76444 24.4995C7.92192 24.5 8.08901 24.5 8.26667 24.5H23.7333C23.911 24.5 24.0781 24.5 24.2356 24.4995M28 20.7361C27.5114 20.1825 26.7965 19.8333 26 19.8333C24.5272 19.8333 23.3333 21.0272 23.3333 22.5C23.3333 23.2962 23.6823 24.0109 24.2356 24.4995M28 20.7361C28.0005 20.5785 28 20.4112 28 20.2333V12.7667C28 12.589 28 12.4219 27.9995 12.2644M28 20.7361C27.9964 21.9022 27.9654 22.5415 27.7094 23.044C27.4537 23.5457 27.0457 23.9537 26.544 24.2094C26.0414 24.4654 25.402 24.4959 24.2356 24.4995M27.9995 12.2644C27.5109 12.8177 26.7962 13.1667 26 13.1667C24.5272 13.1667 23.3333 11.9728 23.3333 10.5C23.3333 9.7038 23.6823 8.98911 24.2356 8.50049M27.9995 12.2644C27.9959 11.098 27.9654 10.4586 27.7094 9.95603C27.4537 9.45426 27.0457 9.04631 26.544 8.79065C26.0414 8.53457 25.402 8.50411 24.2356 8.50049M18.6667 16.5C18.6667 17.9728 17.4728 19.1667 16 19.1667C14.5272 19.1667 13.3333 17.9728 13.3333 16.5C13.3333 15.0272 14.5272 13.8333 16 13.8333C17.4728 13.8333 18.6667 15.0272 18.6667 16.5Z"
                      stroke="#20CC65"
                      stroke-width="2"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <div class="flex flex-col">
                  <p class="text-xs text-[#4D696E] font-normal">
                    {{ $t("totalAmountPaid") }}
                  </p>
                  <p class="text-[16px] font-semibold text-[#061018]">
                    {{ singleData?.total_paid_amount }} UZS
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #beforeSearch>
          <div class="flex flex-row space-x-5">
            <FSelect
              v-if="!isLoading"
              :options="providers"
              v-model="filter.provider"
              selected-option-styles="bg-white !border-gray-800 rounded-md"
              value-key="slug"
              label-key="title"
              class="min-w-[160px]"
              @on-select="toggleSelect"
            />
            <!--              :placeholder="$t('allPaymentMethods')"-->
            <CSearchUsers :user="user" @change="fetchData" />
            <!--              :placeholder="$t('allUsers')"-->
          </div>
        </template>
        <template #_index="{ row: data }">
          <span
            class="text-sm text-dark-100 font-semibold leading-normal"
            v-text="data._index + '.'"
          />
        </template>
        <template #provider="{ row: data }">
          <div class="flex flex-row space-x-3 items-center">
            <img
              alt="no image"
              :src="'/images/providers/' + data?.provider + '.png'"
              class="size-[28px] shrink-0 rounded-md"
            />
            <p class="text-sm font-bold">
              {{ data?.provider }}
            </p>
          </div>
        </template>
        <template #transactions_id="{ row: data }">
          <p
            class="text-xs font-normal cursor-pointer hover:underline"
            @click="openPaymentModal(data?.id)"
          >
            {{ data?.transaction_id }}
          </p>
        </template>
        <template #paid_course="{ row: data }">
          <p class="text-black-100 text-xs font-normal">
            {{ data?.course?.title }}
          </p>
        </template>
        <template #amount="{ row: data }">
          <p class="text-xs font-normal text-[#20CC65]">+{{ data?.amount }}</p>
        </template>
        <template #created_at="{ row: data }">
          <div class="flex flex-col">
            <p class="text-xs font-normal">
              {{ dayjs(data?.paid_at).format("MM.DD.YYYY") }}
            </p>
            <p>
              {{ dayjs(data?.paid_at).format("HH:mm") }}
            </p>
          </div>
        </template>
        <template #user="{ row: data }">
          <div class="flex flex-row space-x-2 items-center">
            <CAvatar
              :image="data.user.avatar"
              class="size-9 shrink-0 rounded-full border-2 border-[rgba(6, 16, 24, 0.10)]"
            />
            <div class="flex flex-col">
              <p class="text-xs font-medium">
                {{ data?.user.full_name }}
              </p>
              <p class="text-xs font-normal text-[#94A8AA] max-w-[200px]">
                {{ data?.user.phone_number }}
              </p>
            </div>
          </div>
        </template>
        <template #status="{ row: data }">
          <p
            v-if="!data?.is_joined_group"
            class="text-yellow-200 text-xs font-normal"
          >
            {{ $t("not_added") }}
          </p>
          <p
            v-if="data?.is_joined_group"
            class="text-green text-xs font-normal"
          >
            {{ $t("added") }}
          </p>
        </template>
      </CTableWrapper>
    </section>
  </div>
  <CTransactionsPaymentModal
    v-bind="{ paymentSingle }"
    :show="showPayment"
    @close="showPayment = false"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { handleError, updateQueryParams } from "@/utils";
import dayjs from "dayjs";
import FSelect from "@/components/Form/Select/FSelect.vue";
import { useRoute } from "vue-router";
import ApiService from "@/services/ApiService";
import FDatePicker from "@/components/Form/Date/FDatePicker.vue";
import CAvatar from "@/components/CAvatar.vue";
import CTransactionsPaymentModal from "@/modules/Transactions/components/CTransactionsPaymentModal.vue";
import CSearchUsers from "@/components/Common/CSearchUsers.vue";

const { t } = useI18n();
const { mounted } = useMounted();
const route = useRoute();
const showPayment = ref(false);
const paymentSingle = ref(null);
const date = ref(
  route.query?.paid_at_gte
    ? `${dayjs(route.query?.paid_at_gte).format("DD.MM.YYYY")} - ${dayjs(
        route.query?.paid_at_lte
      ).format("DD.MM.YYYY")}`
    : ""
);
const provider = ref("all");

watch(
  () => date.value,
  async (newDate) => {
    if (newDate.trim() === "") {
      await updateQueryParams("paid_at_gte", undefined);
      await updateQueryParams("paid_at_lte", undefined);
      fetchTableData();
      return;
    }

    await updateQueryParams(
      "paid_at_gte",
      formatDate(newDate?.split("-")[0]?.replaceAll(" ", ""))
    );
    await updateQueryParams(
      "paid_at_lte",
      formatDate(newDate?.split("-")[1]?.replaceAll(" ", ""))
    );

    fetchTableData();
  }
);

const filter = reactive({
  provider: route.query?.provider ? route.query?.provider : "all",
  order__user: route.query?.order__user ? route.query?.order__user : "",
  ...sortDate(),
});

function sortDate() {
  return {
    paid_at_gte: date.value.split("-")[0]?.replaceAll(" ", ""),
    paid_at_lte: date.value.split("-")?.[1]?.replaceAll(" ", ""),
  };
}

const {
  tableData,
  paginationData,
  onSearch,
  loading,
  onPageChange,
  onChangeLimit,
  fetchTableData,
  singleData,
} = useTableFetch(`payment/transactions/histroy`);
const isLoading = ref(true);

const fetchSingleData = async (id: string) => {
  await ApiService.get(`/payment/transactions/${id}`)
    .then((res) => {
      paymentSingle.value = res.data;
    })
    .catch((err) => {
      handleError(err?.response?.data);
    });
};

const openPaymentModal = (id: string) => {
  showPayment.value = true;
  fetchSingleData(id);
};

const providers = ref([
  {
    slug: "all",
    title: t("all_providers"),
  },
]);

function getProviders() {
  ApiService.query("/payment/providers/list/", {})
    .then((res) => {
      res.data.results.map((provider) => {
        if (
          providers.value.findIndex((item) => item.slug === provider?.slug) ===
          -1
        ) {
          providers.value.push({
            slug: provider?.slug,
            title: provider?.title,
          });
        }
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
}

onMounted(() => {
  getProviders();
});

const toggleSelect = async (e: string) => {
  if (e.slug === "all") {
    provider.value = "all";
    await updateQueryParams("provider", undefined);
    fetchTableData();
    return;
  }
  provider.value = e.slug;

  await updateQueryParams("provider", e.slug);
  fetchTableData();
};

const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("transactions"),
    route: "/",
  },
]);

onMounted(() => {
  setTimeout(() => {
    updateQueryParams("course", undefined);
  }, 4000);
});

const headData = computed(() => {
  let data = [
    {
      title: t("transactionMethod"),
      key: "provider",
    },
    {
      title: t("transactionId"),
      key: "transactions_id",
    },
    {
      title: t("paid_course"),
      key: "paid_course",
    },
    {
      title: t("amount"),
      key: "amount",
    },
    {
      title: t("transactionDate"),
      key: "created_at",
    },
    {
      title: t("user"),
      key: "user",
    },
    {
      title: t("group_status"),
      key: "status",
    },
  ];

  // if (userRole.value === "mentor") {
  //   return data.map((item) =>
  //     item.key === "action"
  //       ? { title: "", key: "" }
  //       : { title: item?.title, key: item?.key }
  //   );
  // }

  return data;
});

function formatDate(dateString) {
  const [day, month, year] = dateString.split(".");
  return `${year}-${month}-${day}`;
}

const user = ref();

if (route.query.order__user) {
  ApiService.get(`/backoffice/StudentDetail/${route.query.order__user}`).then(
    (res) => {
      user.value = res.data;
    }
  );
}

function fetchData() {
  onPageChange(1);
  setTimeout(() => {
    fetchTableData();
  }, 300);
  if (route.query.order__user) {
    ApiService.get(`/backoffice/StudentDetail/${route.query.order__user}`).then(
      (res) => {
        user.value = res.data;
      }
    );
  }
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
