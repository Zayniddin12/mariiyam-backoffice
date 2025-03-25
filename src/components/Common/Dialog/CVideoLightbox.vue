<template>
  <CDialog
    no-header
    has-close-icon
    :show="show"
    body-class="!max-w-[1000px]"
    @close="$emit('close')"
  >
    <div class="aspect-video">
      <iframe
        :src="`https://player.vdocipher.com/v2/?otp=${videoInfo.otp}&playbackInfo=${videoInfo.playback_info}`"
        style="border: 0; width: 100%; height: 100%"
        allow="encrypted-media"
        allowfullscreen
      ></iframe>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import { ref, watch } from "vue";
import apiService from "@/services/ApiService";

interface Props {
  show: boolean;
  videoId: string;
}

const props = defineProps<Props>();
const videoInfo = ref<{ otp: string; playback_info: string }>({
  otp: "",
  playback_info: "",
});
const videoStatusInfo = ref({});
console.log("videoStatusInfo", videoStatusInfo.value);

async function getVideoInfo() {
  try {
    const res = await apiService.post("/study/vdocipher/ObtainOTP/", {
      video_id: props.videoId,
    });
    videoInfo.value = res?.data || { otp: "", playback_info: "" };
  } catch (err) {
    console.error("Failed to fetch video info", err);
  }
}

async function checkForVideoStatus() {
  try {
    const res = await apiService.get(
      `/study/vdocipher/ObtainVideoInfo/${props.videoId}`
    );
    videoStatusInfo.value = res?.data || {};
  } catch (err) {
    console.error("Failed to check video status", err);
  }
}

watch(
  () => props.show,
  async (val) => {
    if (val) {
      await checkForVideoStatus();
      await getVideoInfo();
    }
  },
  {
    immediate: true,
  }
);
</script>
