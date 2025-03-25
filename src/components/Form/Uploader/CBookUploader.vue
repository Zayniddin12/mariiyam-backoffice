<template>
  <div
    class="h-full w-full relative"
    @dragover.prevent="handleDragOver"
    @drop.prevent="handleDrop"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
  >
    <input
      :id="id"
      type="file"
      name="file"
      class="w-0 h-0 absolute"
      :accept="accept ?? 'image/png, image/jpeg, application/pdf'"
      @change="handleFile"
      @click="$event.target.value = ''"
    />
    <div
      class="w-full relative h-[142px] flex items-center justify-center flex-col rounded-lg transition-300 cursor-pointer px-6 py-11 border-2 border-dashed border-gray-800 hover:border-gray-400/50"
      :class="{ '!border-red': error }"
      @click="getFile"
    >
      <slot v-if="!fileData">
        <div class="text-base flex items-center flex-col">
          <i class="icon-doc-text text-blueDark text-[32px]"></i>
          <p class="mt-4 text-sm leading-130 font-medium text-dark-100">
            {{ $t("drop_files") }}
          </p>
          <i18n-t
            keypath="choose_file"
            tag="p"
            class="mt-1 text-xs leading-130 font-normal text-gray"
          >
            <template #choose>
              <span
                class="text-blueDark font-semibold cursor-pointer hover:text-dark transition-300"
                @click="getFile"
              >
                {{ $t("choose_text") }}
              </span>
            </template>
          </i18n-t>
        </div>
      </slot>
      <div v-else class="text-center relative flex w-full flex-col gap-x-2">
        <div
          class="duration-200 transition-all absolute group right-0 w-9 h-9 bg-red-100 flex items-center justify-center z-20 rounded-lg cursor-pointer hover:bg-red"
          @click.stop="deleteFile"
        >
          <span
            class="transition-300 icon-trash text-red text-2xl group-hover:text-white"
          />
        </div>
        <i class="icon-book text-4.5xl text-blueDark" />
        <p
          class="text-sm mx-auto font-medium max-w-48 whitespace-normal text-dark-400 mt-2"
        >
          <a
            v-if="fileData.url"
            :href="fileData.url"
            target="_blank"
            class="text-blue-500 underline hover:text-blue-700"
            @click.stop
          >
            {{ fileData.name }}
          </a>
          <span v-else>
            {{ fileData.name }}
          </span>
        </p>
        <p v-if="fileData.size" class="text-xs text-gray-450 mt-1">
          {{ convertBytes(fileData.size) }}
        </p>
      </div>
      <div
        v-if="dragging"
        class="delay-75 ease-in w-full h-full bg-dark-100 bg-opacity-80 rounded-lg absolute p-2"
      >
        <div
          class="w-full h-full border-dashed border-2 rounded-md border-white border-opacity-60 flex items-center justify-center"
        >
          <p class="text-white text-base font-bold !leading-[130%]">
            {{ $t("drop_file_here") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineEmits, defineProps, onMounted, ref, watch } from "vue";
import { convertBytes } from "@/utils";

interface Props {
  error?: boolean;
  id: string;
  accept?: string;
  defaultFile?: { name: string; size?: number; url?: string } | null; // Add optional URL
}

const props = defineProps<Props>();
const emit = defineEmits(["fileSelected"]);

const dragging = ref(false);
const currentTarget = ref<HTMLElement | null>(null);
const fileData = ref(props.defaultFile || null); // Initialize with defaultFile

const getFile = () => {
  const input = document.getElementById(props.id) as HTMLInputElement;
  input?.click();
};

const handleFile = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  if (target?.files?.length) {
    const file = target.files[0]; // Only the first file is allowed
    fileData.value = { name: file.name, size: file.size }; // Set file details for display
    emit("fileSelected", file); // Emit the raw file
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const handleDragEnter = (event: DragEvent) => {
  dragging.value = true;
  currentTarget.value = event.target as HTMLElement;
};

const handleDragLeave = (event: DragEvent) => {
  if (event.target === currentTarget.value) {
    dragging.value = false;
    currentTarget.value = null;
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  dragging.value = false;

  if (event.dataTransfer?.files.length) {
    const file = event.dataTransfer.files[0]; // Only the first file is allowed
    fileData.value = { name: file.name, size: file.size }; // Set file details for display
    const formData = new FormData();
    formData.append("file", file, file.name);
    emit("fileSelected", formData); // Emit the FormData
  }
};

const deleteFile = () => {
  fileData.value = null; // Clear the file data
  const input = document.getElementById(props.id) as HTMLInputElement;
  if (input) input.value = ""; // Reset the input value
  emit("fileSelected", null); // Emit null to indicate no file is selected
};

// Populate fileData with defaultFile if provided
watch(
  () => props.defaultFile,
  () => {
    if (props.defaultFile) {
      fileData.value = props.defaultFile;
    }
  }
);
</script>
