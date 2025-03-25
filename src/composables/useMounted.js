import { nextTick, onMounted, ref } from "vue";
export function useMounted() {
  const mounted = ref(false);
  onMounted(() => {
    nextTick(() => {
      mounted.value = true;
    });
    const placeholder = document.getElementById("header-breadcrumbs");
    if (placeholder) {
      placeholder.innerHTML = "";
    }
  });
  return { mounted };
}
//# sourceMappingURL=useMounted.js.map
