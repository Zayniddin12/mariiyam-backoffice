<template>
  <div>
    <CCommonHeader :title="fullName" :image="user.avatar" no-tabs>
      <template #subTitle>
        <CProfileStatus
          :status="user.is_online ? 'online' : 'offline'"
          :date-joined="user?.last_login ?? 'offline'"
          class="mt-2"
        />
      </template>
      <template #details>
        <CProfileDashDetail
          v-for="(detail, index) in dataDetails"
          :key="index"
          v-bind="{ ...detail, loading }"
        />
      </template>
      <template #actions>
        <CButton
          class="h-9 flex-center text-xs"
          variant="info"
          icon="icon-key-converted"
          :text="$t('student_profile.edit_parole')"
          icon-position="left"
          @click="showResetPassword = true"
        />
        <CButton
          v-if="user?.is_active"
          class="h-9 flex-center text-xs"
          variant="warning"
          icon="icon-lock"
          :text="$t('student_profile.block')"
          icon-position="left"
          @click="showIsBlock = true"
        />
        <CButton
          v-else
          class="h-9 flex-center text-xs"
          variant="warning-yellow"
          icon="icon-unlock"
          :text="$t('student_profile.unblock')"
          icon-position="left"
          @click="showIsBlock = true"
        />
      </template>
    </CCommonHeader>
    <div class="mt-5">
      <RouterView />
    </div>
  </div>
  <CBlockModal
    :show="showIsBlock"
    :is-blocked="!user?.is_active"
    @close="showIsBlock = false"
    @submit="blockAndUnlockStudent"
  />
  <CResetPasswordModal
    v-bind="{ form }"
    :show="showResetPassword"
    @close="closeResetPasswordModal"
    @submit="resetPassword"
    :loading="resettingPassword"
  />
</template>

<script setup lang="ts">
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import { computed, ref } from "vue";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import { useI18n } from "vue-i18n";
import { formatPhoneNumber } from "@/utils";
import dayjs from "dayjs";
import CProfileStatus from "@/modules/Students/components/CProfileStatus.vue";
import CButton from "@/components/Common/CButton.vue";
import CBlockModal from "@/modules/Students/components/CBlockModal.vue";
import { useStudentsStore } from "@/modules/Students/store";
import { useRoute } from "vue-router";
import { useCustomToast } from "@/composables/useCustomToast";
import CResetPasswordModal from "@/modules/Students/components/CResetPasswordModal.vue";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import { useHandleError } from "@/composables/useHandleError";
import { useAuthStore } from "@/modules/Auth/stores";

const { handleError } = useHandleError();

const { t } = useI18n();
const store = useStudentsStore();
const authStore = useAuthStore();
const route = useRoute();
const { showToast } = useCustomToast();

const user = computed(() => store.student);
const resettingPassword = ref(false);

const fullName = computed(() => user.value?.full_name ?? "");
const showIsBlock = ref(false);
const showResetPassword = ref(false);

const loading = computed(() => authStore.profileLoading);
const dataDetails = computed(() => [
  {
    title: formatPhoneNumber(user.value?.phone_number),
    description: t("student_profile.phone_number"),
  },
  {
    title: user.value?.email,
    description: t("student_profile.email"),
  },
  {
    title: user.value?.gender ? t(user.value?.gender) : user.value?.gender,
    description: t("student_profile.gender"),
  },
  {
    title: user.value?.region,
    description: t("student_profile.region"),
  },
  {
    title: dayjs(user.value?.date_joined).format("DD MMMM YYYY"),
    description: t("student_profile.registration_date"),
  },
]);

const blockAndUnlockStudent = () => {
  showIsBlock.value = false;
  store
    .updateStudent(user.value)
    .then(() => {
      showToast(t("student_updated_successfully"), "success");
      store.fetchStudent(route?.path?.split("/")[2]);
    })
    .catch(() => {
      showToast(t("student_update_error"), "error");
    });
};

const form = useForm(
  {
    new_password: "",
  },
  {
    new_password: { required },
  }
);

const closeResetPasswordModal = () => {
  form.values.new_password = "";
  form.$v.value.$reset();
  showResetPassword.value = false;
};

const resetPassword = () => {
  if (!form.$v.value.$invalid) {
    resettingPassword.value = true;
    store
      .resetStudentPassword(user.value?.id, form.values)
      .then(() => {
        showToast(t("student_updated_successfully"), "success");
        store.fetchStudent(route?.path?.split("/")[2]);
        closeResetPasswordModal();
      })
      .catch(({ response }) => {
        handleError(response);
      })
      .finally(() => (resettingPassword.value = false));
  }
};

// Fetch Single Student data
store.fetchStudent(route?.path?.split("/")[2]);
</script>
