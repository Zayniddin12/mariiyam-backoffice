<template>
  <CDropdown class="min-w-[180px]" selected-option-styles="!bg-transparent !p-0" :options="[{}, {}]" @toggle="fetchStudents()">
    <template #head>
      <FInput v-model="searchText" :placeholder="$t('allUsers')" class="bg-transparent !border-[#EDF0F2]" input-class="placeholder:text-[#061018]" />
    </template>
      <div class="p-2 max-h-[200px] overflow-y-auto">
        <div class="!text-black cursor-pointer hover:bg-gray-800 transition-300 px-2 py-1.5 rounded" :class="{'bg-gray-800': user?.id === selectedUser}" v-for="(user, index) in users" :key="index" @click="handleSelectUser(user)">
          <p class="text-sm leading-130">{{user?.full_name}}</p>
        </div>
        <div ref="target" v-if="!loading && paginationData.total > users?.length" />
      </div>
  </CDropdown>
</template>

<script setup lang="ts">
import FInput from "@/components/Form/Input/FInput.vue";
import {useIntersectionObserver} from "@vueuse/core";
import {ref, watch} from "vue";
import ApiService from "@/services/ApiService";
import {useI18n} from "vue-i18n";
import CDropdown from "@/components/Common/CDropdown.vue";
import {debounce, updateQueryParams} from "@/utils";



interface Props {
  user: any
}

const { t } = useI18n();
const props = defineProps<Props>()
const $emit = defineEmits(['change'])

const users = ref()
const selectedUser = ref("")
const searchText = ref( "")
const loading = ref(true)

const paginationData = ref({
  defaultLimit: 12,
  currentPage: 1,
  total: 0,
});

function fetchStudents(searchText?: string) {
  loading.value = true
  paginationData.value.currentPage = 1
  ApiService.query(`/backoffice/StudentList`, {
    params: {
      search: searchText || undefined,
      page_size: paginationData.value.defaultLimit,
      page: paginationData.value.currentPage,
    }
  }).then((res: any) => {
    users.value = [
      {
        id: "",
        full_name: t("allUsers"),
      },
        ...res.data.results
    ]
    paginationData.value.total = res.data.count
  }).finally(() => {
    loading.value = false
  })
}

fetchStudents()


async function handleSelectUser(user: any) {
  paginationData.value.currentPage = 1
  selectedUser.value = user.id
  searchText.value = user.full_name
  await updateQueryParams("order__user", user.id)
  $emit('change')
}


watch(() => searchText.value, () => {
  debounce('search-student', () => {
    paginationData.value.currentPage = 1
    fetchStudents(searchText.value)
  }, 400)
})

const target = ref(null)
const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
     if (isIntersecting) {
       loading.value = true
       paginationData.value.currentPage++
       ApiService.query(`/backoffice/StudentList/`, {
         params: {
           page_size: paginationData.value.defaultLimit,
           page: paginationData.value.currentPage,
         }
       }).then((res: any) => {
         users.value.push(...res.data.results)
         paginationData.value.total = res.data.count
       }).finally(() => {
         loading.value = false
       })
     }
    },
)


watch(() => props.user, () => {
  if (props.user?.id) {
    selectedUser.value = props.user?.id
    searchText.value = props.user?.full_name
  }
}, {
  deep: true,
  immediate: true
})
</script>

