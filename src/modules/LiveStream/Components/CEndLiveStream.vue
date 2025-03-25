<template>
  <CDialog
    :show="show"
    body-class="!max-w-[376px]"
    no-header
    @close="$emit('close')"
  >
    <Transition name="fade" mode="out-in">
      <div :key="step">
        <CEndLiveStreamWarning
          v-if="step === 1"
          @submit="handleSubmit"
          @close="$emit('close')"
        />
      </div>
    </Transition>
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import { handleError, ref } from "vue";
import ApiService from "@/services/ApiService";
import { useCustomToast } from "@/composables/useCustomToast";
import CEndLiveStreamWarning from "@/modules/LiveStream/Components/CEndLiveStreamWarning.vue";
import { useI18n } from "vue-i18n";

interface Props {
  show: boolean;
  id: string;
  userRole: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["close", "submit"]);
const { showToast } = useCustomToast();
const { t } = useI18n();

const handleSubmit = async () => {
  try {
    const response = await ApiService.put(
      `/study/live-streams/${props.id}/set-end/`
    );
    if (response.status === 200) {
      emit("close");
      showToast(t("livestream_updated_successfully"), "success");
      emit("submit");
    }
  } catch (error) {
    handleError(error);
  }
};

const step = ref(1);
</script>
