import useVuelidate from "@vuelidate/core";
import { reactive } from "vue";
export function useForm(...args) {
  const [initialValues, validations, vuelidateConfig] = args;
  const values = reactive(initialValues);
  const $v = useVuelidate(validations, values, vuelidateConfig);
  return { values, $v };
}
//# sourceMappingURL=useForm.js.map
