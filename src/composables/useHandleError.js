import { useCustomToast } from "@/composables/useCustomToast";
import { useI18n } from "vue-i18n";
export const useHandleError = () => {
  const { showToast } = useCustomToast();
  const { t } = useI18n();
  function handleError(error) {
    if (error?.data?.length) {
      try {
        showToast(error?.data[0]?.error?.message, "error");
      } catch {
        showToast(t("error"), "error");
      }
    }
  }
  return { handleError };
};
//# sourceMappingURL=useHandleError.js.map
