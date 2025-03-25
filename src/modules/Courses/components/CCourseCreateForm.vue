<template>
  <div class="grid grid-cols-12 gap-6 mt-6">
    <div class="2xl:col-span-9 col-span-8">
      <CCard class="p-6">
        <div>
          <h3 class="text-dark-100 text-xl font-semibold">
            {{ $t("general_information") }}
          </h3>
          <div class="w-full h-px bg-gray-900 my-4" />
          <CTabLang v-model="nameValue" :list="tabListLanguage" withIcon />
          <FGroup
            v-if="nameValue === 'uz'"
            :label="$t('title_uz')"
            class="mt-4"
          >
            <FInput
              :placeholder="$t('enter_title_uz')"
              v-model="values.title_uz"
              :error="form.$v.value.title_uz.$error"
            />
          </FGroup>

          <FGroup
            v-if="nameValue === 'ru'"
            :label="$t('title_ru')"
            class="mt-4"
          >
            <FInput
              :placeholder="$t('enter_title_ru')"
              v-model="values.title_ru"
              :error="form.$v.value.title_ru.$error"
            />
          </FGroup>

          <FGroup
            v-if="nameValue === 'en'"
            :label="$t('title_en')"
            class="mt-4"
          >
            <FInput
              :placeholder="$t('enter_title_en')"
              v-model="values.title_en"
              :error="form.$v.value.title_en.$error"
            />
          </FGroup>

          <FGroup
            v-if="nameValue === 'uz'"
            :label="$t('subtitle_uz')"
            class="mt-4"
          >
            <FTextarea
              textarea-class="min-h-[120px]"
              :placeholder="$t('enter_subtitle_uz')"
              v-model="values.subtitle_uz"
              :error="form.$v.value.subtitle_uz.$error"
              maxlength="500"
            />
          </FGroup>

          <FGroup
            v-if="nameValue === 'ru'"
            :label="$t('subtitle_ru')"
            class="mt-4"
          >
            <FTextarea
              textarea-class="min-h-[120px]"
              :placeholder="$t('enter_subtitle_ru')"
              v-model="values.subtitle_ru"
              :error="form.$v.value.subtitle_ru.$error"
              maxlength="500"
            />
          </FGroup>

          <FGroup
            v-if="nameValue === 'en'"
            :label="$t('subtitle_en')"
            class="mt-4"
          >
            <FTextarea
              textarea-class="min-h-[120px]"
              :placeholder="$t('enter_subtitle_en')"
              v-model="values.subtitle_en"
              :error="form.$v.value.subtitle_en.$error"
              maxlength="500"
            />
          </FGroup>

          <div class="w-full h-px bg-gray-900 my-4" />

          <div class="grid grid-cols-2 gap-x-4 mt-4">
            <FGroup :label="$t('coursePriceUZS')">
              <FInput
                v-maska="moneyMask"
                :placeholder="$t('enterPrice')"
                v-model="values.price"
                :error="form.$v.value.price?.$error"
              />
            </FGroup>

            <FGroup :label="$t('course_category')">
              <FormSelect
                v-model="values.category"
                :defaultValue="values.category"
                label-key="title"
                value-key="id"
                save-name="category"
                :placeholder="$t('choose_category')"
                api="backoffice/CourseCategoryList/"
                default-value-key="id"
                :no-data-title="$t('no_categories')"
              >
                <template #activeIcon="{ data }">
                  <i
                    class="icon-tick-square text-blueDark"
                    v-if="data?.id === values.category"
                  />
                </template>
              </FormSelect>
            </FGroup>
          </div>

          <div class="flex flex-row items-center mt-4 space-x-4">
            <FGroup :label="$t('discountInPercent')" class="w-1/2">
              <FInput
                :maxlength="100"
                :max="100"
                :placeholder="$t('enterDiscountPercentage')"
                @focus="$event.target.select()"
                v-maska="'###%'"
                v-model="formattedDiscountPercentage"
              />
              <!--              :error="form.$v.value.discount?.percentage?.$error"-->
            </FGroup>
          </div>

          <div class="flex flex-row items-center mt-4 space-x-4">
            <FGroup :label="$t('discountStartDate')">
              <FDatePicker
                :placeholder="$t('enter_title')"
                :min-date="new Date()"
                v-model="values.discount.start_date"
              />
              <!--              :error="form.$v.value.discount?.start_date?.$error"-->
            </FGroup>
            <FGroup :label="$t('discountEndDate')">
              <FDatePicker
                :disabled="values.discount.start_date === ''"
                :min-date="
                  new Date(formatDateRightOrder(values.discount.start_date))
                "
                :placeholder="$t('enter_title')"
                v-model="values.discount.end_date"
              />
              <!--              :error="form.$v.value.discount?.end_date?.$error"-->
            </FGroup>
          </div>

          <FGroup :label="$t('automatic')" class="mt-4">
            <FCheckbox
              :checked="values.is_auto"
              class="translate-y-0.5 w-fit"
              v-model="values.is_auto"
              @change="values.is_auto = !values.is_auto"
            />
          </FGroup>
        </div>
      </CCard>
    </div>
    <CCard class="2xl:col-span-3 col-span-4 p-5 h-fit">
      <h3 class="text-dark-100 text-sm mb-2">
        {{ $t("cover") }}
      </h3>
      <ImageUploader
        @change="values.cover = $event"
        :default-image="values?.cover"
        :error="form.$v.value.cover.$error"
        :key="loading"
      />
    </CCard>
  </div>
</template>
<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import ImageUploader from "@/components/Form/Uploader/ImageUploader.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import FTextarea from "@/components/Form/FTextarea.vue";
import { TForm } from "@/composables/useForm";
import { computed, onMounted, ref, unref, watch } from "vue";
import FDatePicker from "@/components/Form/Date/FDatePicker.vue";
import { debounce, formatDateRightOrder, moneyMask } from "@/utils";
import FCheckbox from "@/components/Form/FCheckbox.vue";
import CTabLang from "@/components/Tab/CTabLang.vue";
import { tabListLanguage } from "@/modules/Courses/data.ts";
import ApiService from "@/services/ApiService";
import FormSelect from "@/components/Form/SearchableSelect/FormSelect.vue";

interface Props {
  form: TForm<any>;
  loading?: boolean;
  activeTab?: string;
}
const props = defineProps<Props>();
const nameValue = ref<string>("uz");

const { values, $v } = unref(props.form);

const categories = ref([]);

function getCategories() {
  ApiService.get("/backoffice/CourseCategoryList").then((res) => {
    categories.value = res.data?.results;
  });
}

const formattedDiscountPercentage = computed({
  get() {
    return values.discount.percentage || "";
  },
  set(newValue) {
    const cleanVal = newValue.replace("%", "");
    if (Number(cleanVal) > 100) {
      values.discount.percentage = "100%";
      return;
    }
    debounce(
      "discount-percentage",
      () => {
        let inputValue = newValue;
        inputValue = inputValue.replace("%", "");
        const numberValue = parseInt(inputValue, 10);

        if (numberValue > 100) {
          values.discount.percentage = "100%";
        } else if (numberValue >= 0) {
          values.discount.percentage = numberValue + "%";
        } else {
          values.discount.percentage = "";
        }
      },
      300
    );
  },
});

const checkValidity = (newVal: string) => {
  if (
    values.discount.end_date &&
    new Date(formatDateRightOrder(newVal)) >
      new Date(formatDateRightOrder(values.discount.end_date))
  ) {
    values.discount.end_date = "";
  }
};

watch(
  () => values.discount.start_date,
  (newVal) => {
    if (!newVal) {
      values.discount.end_date = ""; // Reset end_date if start_date is cleared
    } else {
      checkValidity(newVal);
    }
    if (
      values.discount.start_date.length === 10 &&
      new Date(formatDateRightOrder(values.discount.start_date)).getDate() <
        new Date().getDate()
    ) {
      values.discount.start_date = "";
    }
  }
);

watch(
  () => values.discount.end_date,
  () => {
    if (
      values.discount.end_date.length === 10 &&
      new Date(formatDateRightOrder(values.discount.end_date)) <
        new Date(formatDateRightOrder(values.discount.start_date))
    ) {
      values.discount.end_date = "";
    }
  }
);

onMounted(() => {
  getCategories();
});
</script>
