<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div class="relative">
    <CBackButton :link="'/students/' + route.path?.split('/')[2]" />
    <CCommonHeader no-tabs no-image class="relative overflow-hidden" active="">
      <template #title>
        <div></div>
      </template>
      <template #subTitle>
        <div class="flex gap-4">
          <CAvatar
            :image="course?.details?.photo ?? ''"
            class="!rounded-lg w-[88px] h-[88px] before:!rounded-lg border-2 border-gray-800 shrink-0"
          />
          <div>
            <p class="text-xl leading-130 font-semibold text-dark-100">
              {{ course?.details?.title ?? "" }}
            </p>
            <p class="mt-2 text-sm leading-130 font-normal text-dark-100">
              {{ course?.details?.description ?? "" }}
            </p>
          </div>
        </div>
      </template>
      <template #details>
        <CProfileDashDetail :description="t('point')">
          <p class="text-sm leading-130 text-gray">
            <span class="text-dark-100">
              {{ course?.details?.received_ball }}
            </span>
            /
            {{ course?.details?.ball }}
          </p>
        </CProfileDashDetail>
        <CProfileDashDetail
          :description="t('follow_name')"
          :title="`${course?.flow_name ?? ''}: ${course?.group_name ?? ''}`"
        >
        </CProfileDashDetail>
        <CProfileDashDetail
          v-if="course?.is_paid"
          :description="t('status_payment')"
        >
          <p
            class="text-sm leading-130 font-medium text-blueDark flex-y-center gap-1"
          >
            <i class="icon-tick-circle text-base" /> {{ t("payed") }}
          </p>
        </CProfileDashDetail>
        <CProfileDashDetail v-else :description="t('status_payment')">
          <p
            class="text-sm leading-130 font-medium text-red flex-y-center gap-1"
          >
            <i class="icon-forbidden text-base" /> {{ t("no_succeed") }}
          </p>
        </CProfileDashDetail>
      </template>
      <template #content>
        <div class="w-full p-5">
          <CTableWrapper
            :head="headData"
            :data="course?.modules ?? []"
            :items-per-page="10"
            :limit="10"
            :total="course?.modules?.length ?? 0"
            :current-page="1"
            :title="t('modules')"
            :subtitle="
              t('modules_count', { count: course?.modules?.length ?? 0 })
            "
            th-class="last:!text-left"
            @search="handleSearch"
          >
            <template #_index="{ row: data }">
              <span
                class="text-sm text-dark-100 font-semibold leading-normal"
                v-text="data._index + '.'"
              />
            </template>
            <template #module="{ row: data }">
              <RouterLink
                :to="{
                  name: 'StudentsModuleSingleLessons',
                  params: { moduleId: data?.id },
                }"
                class="text-sm leading-130 font-medium text-dark-100 hover:text-blueDark transition-300"
              >
                {{ data?.details?.title ?? "" }}
              </RouterLink>
            </template>
            <template #process="{ row: data }">
              <CCourseProcessCard
                v-if="data?.is_available"
                :value="data?.viewed_duration"
                :max="data?.duration"
              >
                <template #title>
                  <p class="text-xs leading-130 font-medium text-gray">
                    <span class="text-dark-100">{{
                      secondsToTime(data?.viewed_duration, true)
                    }}</span>
                    /
                    {{ secondsToTime(data?.duration, true) }}
                  </p>
                </template>
              </CCourseProcessCard>
              <p
                v-else
                class="text-xs leading-130 font-medium text-gray flex-y-center gap-1"
              >
                <i class="icon-lock text-base" /> {{ $t("not_available") }}
              </p>
            </template>
            <template #start="{ row: data }">
              <p class="text-xs leading-130 text-dark-100">
                {{ dayjs(data?.start_date).format("DD.MM.YYYY") }}
              </p>
            </template>
            <template #end="{ row: data }">
              <p class="text-xs leading-130 text-dark-100">
                {{ dayjs(data?.end_date).format("DD.MM.YYYY") }}
              </p>
            </template>
            <template #lesson="{ row: data }">
              <p class="text-xs leading-130 text-gray">
                <span class="text-dark-100">{{
                  data?.completed_lessons_count
                }}</span>
                /
                {{ data?.lessons_count }}
              </p>
            </template>
            <template #assignment="{ row: data }">
              <p class="text-xs leading-130 text-gray">
                <span class="text-dark-100">{{
                  data?.submitted_assignments_count
                }}</span>
                /
                {{ data?.assignments_count }}
              </p>
            </template>
          </CTableWrapper>
        </div>
      </template>
    </CCommonHeader>
  </div>
</template>

<script setup lang="ts">
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import dayjs from "dayjs";
import CCourseProcessCard from "@/modules/Students/components/CCourseProcessCard.vue";
import { debounce, secondsToTime } from "@/utils";
import CBackButton from "@/modules/Students/components/CBackButton.vue";
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import { computed, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useMounted } from "@/composables/useMounted";
import CAvatar from "@/components/CAvatar.vue";
import { useStudentsStore } from "@/modules/Students/store";
import { useRoute } from "vue-router";

const { t } = useI18n();
const { mounted } = useMounted();
const route = useRoute();
const store = useStudentsStore();

const user = computed(() => store.student);
const course = computed(() => store.course);

const routes = computed(() => [
  {
    name: t("students"),
    route: "/students",
  },
  {
    name: user.value?.full_name,
    route: "/students/" + route.path?.split("/")[2],
  },
  {
    name: course.value?.details?.title ?? "",
    route:
      "/students/" +
      route.path?.split("/")[2] +
      "/" +
      route.path?.split("/")[3],
  },
]);

const headData = [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "module_name",
    key: "module",
  },
  {
    title: "process",
    key: "process",
  },
  {
    title: "start",
    key: "start",
  },
  {
    title: "end",
    key: "end",
  },
  {
    title: "lessons",
    key: "lesson",
  },
  {
    title: "assignments",
    key: "assignment",
  },
];

// States
const pagination = reactive({
  page: 1,
  page_size: 10,
});
const search = ref("");

function handleSearch(value: string) {
  search.value = value;
  pagination.page = 1;
  debounce("search", () => {
    store.fetchStudentCourseDetail(String(route.params?.courseId), {
      ...pagination,
      search: value || undefined,
    });
  });
}

// Fetch data
store.fetchStudentCourseDetail(String(route.params?.courseId), {
  ...pagination,
  search: search.value || undefined,
});
// console.log(route);
// store.fetchStudentCourseSingle(Number(route.params?.courseId));
</script>
