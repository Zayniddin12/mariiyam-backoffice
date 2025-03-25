<template>
  <CTableWrapper
    :nodata-title="$t('no_sales')"
    nodata-subtitle=""
    :title="$t('sales_history')"
    :subtitle="$t('count_sales_history', { count: bookStore.count })"
    :head="headData"
    :data="transactions"
    :limit="tableParams.page_size"
    :total="bookStore.count"
    :current-page="tableParams.page"
    :items-per-page="tableParams.page_size"
    :loading="bookStore.transactionsLoading"
    @page-change="onPageChange($event)"
    @items-per-page="onLimitChange($event)"
    @search="onSearch($event)"
  >
    <template #beforeSearch>
      <FSelect
        :key="providers.length"
        v-model="tableParams.provider"
        class="min-w-44"
        :options="providers"
        label-key="label"
        value-key="value"
      />
    </template>

    <template #afterSearch>
      <FDatePicker v-model="filterDate" range class="min-w-56" />
    </template>

    <template #transactionMethod="{ row: data }">
      <div class="flex items-center gap-x-3">
        <div
          class="size-7 p-1 rounded-lg flex items-center overflow-hidden border border-gray-360"
        >
          <img :src="data?.payment_providers?.icon" class="object-cover" />
        </div>
        <p class="text-dark-400 text-sm font-bold">
          {{ data?.payment_providers?.title }}
        </p>
      </div>
    </template>
    <template #amount="{ row: data }">
      <p class="text-xs text-green-200">
        {{ "+" + formatMoneyDecimal(data?.amount) }}
      </p>
    </template>
    <template #transactionDate="{ row: data }">
      <p class="text-dark-301 text-xs">
        {{ dayjs(data?.created_at).format("DD.MM.YYYY") }}
      </p>
      <p class="text-xs text-gray-470">
        {{ dayjs(data?.created_at).format("HH:mm") }}
      </p>
    </template>
    <template #user="{ row: data }">
      <div class="flex gap-x-2 items-center">
        <div
          class="size-9 p-1 rounded-full flex items-center overflow-hidden border border-gray-360"
        >
          <img
            :src="data?.user_detail?.avatar ?? '/images/svg/no-data/user.svg'"
            class="object-cover"
          />
        </div>
        <div>
          <p class="text-dark-301 text-xs font-medium">
            {{ data?.user_detail?.full_name }}
          </p>
          <p class="text-xs text-gray-470">
            {{ data?.user_detail?.phone_number }}
          </p>
        </div>
      </div>
    </template>
  </CTableWrapper>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import { debounce, formatMoneyDecimal, updateQueryParams } from "@/utils";
import dayjs from "dayjs";
import apiService from "@/services/ApiService";
import { computed, onMounted, ref, watch } from "vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import FDatePicker from "@/components/Form/Date/FDatePicker.vue";
import { useBooksStore } from "@/modules/Books/store";
import { useI18n } from "vue-i18n";

const route = useRoute();
const { t } = useI18n();

const providers = ref([{ label: t("allPaymentMethods"), value: "all" }]);
const filterDate = ref("");
const tableParams = ref({
  page: 1,
  page_size: 10,
  search: "",
  provider: "all",
  start_date: "",
  end_date: "",
});
const bookStore = useBooksStore();

function getTransactions() {
  bookStore.fetchTransaction(String(route.params.id), { ...tableParams.value });
}

const transactions = computed(() => bookStore.transactions);

const headData = [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "transactionMethod",
    key: "transactionMethod",
  },
  {
    title: "transactionId",
    key: "id",
  },
  {
    title: "amount",
    key: "amount",
  },
  {
    title: "transactionDate",
    key: "transactionDate",
  },
  {
    title: "user",
    key: "user",
  },
];

function fetchProviders() {
  apiService.get("payment/payment-providers").then((res) => {
    const fetchedProviders = res?.data?.results?.map((item) => ({
      label: item?.title,
      value: item?.provider,
    }));
    providers.value = [...providers.value, ...fetchedProviders];
  });
}

function onPageChange(page: number) {
  tableParams.value.page = page;
  updateQueryParams("page", String(tableParams.value.page));
  getTransactions();
}

function onLimitChange(limit: number) {
  tableParams.value.page_size = limit;
  onPageChange(1);
  route.query.page = "1";
  updateQueryParams("page_size", String(tableParams.value.page_size));
  getTransactions();
}

function onSearch(search: string) {
  tableParams.value.search = search;
  debounce("user_search", () => {
    updateQueryParams("search", tableParams.value.search);
    getTransactions();
  });
}

watch(
  () => tableParams.value.provider,
  () => {
    updateQueryParams("provider", tableParams.value.provider);
    getTransactions();
  }
);

watch(
  () => filterDate.value,
  () => {
    if (filterDate.value.length) {
      updateQueryParams("range", filterDate.value);
      tableParams.value.start_date = filterDate.value
        .split(" - ")[0]
        .split(".")
        .reverse()
        .join("-");
      tableParams.value.end_date = filterDate.value
        .split(" - ")[1]
        .split(".")
        .reverse()
        .join("-");
      getTransactions();
    } else {
      updateQueryParams("range", "");
      tableParams.value.start_date = "";
      tableParams.value.end_date = "";
      getTransactions();
    }
  }
);

watch(
  () => route.query,
  () => {
    if (route.query.page) {
      tableParams.value.page = Number(route.query.page);
      updateQueryParams("page", String(tableParams.value.page));
    }
    if (route.query.page_size) {
      tableParams.value.page_size = Number(route.query.page_size);
      updateQueryParams("page_size", String(tableParams.value.page_size));
    }
    if (route.query.search) {
      tableParams.value.search = String(route.query.search);
      updateQueryParams("search", tableParams.value.search);
    }
    if (route.query.provider) {
      tableParams.value.provider = String(route.query.provider);
    }
    if (route.query.range) {
      filterDate.value = String(route.query.range);
      tableParams.value.start_date = filterDate.value
        .split(" - ")[0]
        .split(".")
        .reverse()
        .join("-");
      tableParams.value.end_date = filterDate.value
        .split(" - ")[1]
        .split(".")
        .reverse()
        .join("-");
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  getTransactions();
  fetchProviders();
});
</script>
