import { defineStore } from "pinia";
import apiService from "@/services/ApiService";
import ApiService from "@/services/ApiService";
export const useCoursesStore = defineStore("courseStore", {
  state: () => ({
    workers: [],
    single: {},
    courseSingle: {},
    loading: true,
    vdoCipherData: {},
  }),
  actions: {
    fetchWorkers(search) {
      return new Promise((resolve, reject) => {
        apiService
          .query("backoffice/WorkerList/", {
            params: {
              search,
            },
          })
          .then((response) => {
            this.workers = response.data.results;
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setSingle(payload) {
      this.single = payload;
      sessionStorage.setItem("courseTitle", payload?.title ?? "");
    },
    fetchSingleCourse(id) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        ApiService.get(`/backoffice/Courses/${id}`)
          .then((res) => {
            this.courseSingle = res.data;
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
  },
});
//# sourceMappingURL=store.js.map
