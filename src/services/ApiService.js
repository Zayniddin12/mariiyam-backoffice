import axios from "axios";
import VueAxios from "vue-axios";
import { JwtService } from "@/services/JwtService";
import router from "@/router";
class ApiService {
  static vueInstance;
  static init(app) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_BASE_URL;
    this.handleResponseError(ApiService.vueInstance?.axios);
  }
  static refreshToken(axios) {
    return new Promise((resolve, reject) => {
      const refresh = JwtService.getRefresh();
      if (!refresh) {
        JwtService.destroyAccess();
        return router.push({ name: "PAuth" });
      }
      const headersWithoutAuth = { ...axios.defaults.headers };
      delete headersWithoutAuth.common.Authorization;
      axios
        .post(
          import.meta.env.VITE_APP_BASE_URL + "account/TokenRefresh/",
          {
            refresh: refresh,
          },
          {
            headers: { ...headersWithoutAuth.post },
          }
        )
        .then(({ data }) => {
          JwtService.saveToken(data.access);
          ApiService.setHeader();
          resolve(data.access);
        })
        .catch(async (error) => {
          this.unsetHeader();
          localStorage.removeItem("refresh");
          localStorage.removeItem("id_token");
          JwtService.destroyAccess();
          JwtService.destroyRefresh();
          await router.push({ name: "PAuth" });
          reject(error);
        });
    });
  }
  static handleResponseError(axios) {
    let originalRequest = null;
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const errorResponse = error?.response;
        originalRequest = error?.config;
        if (errorResponse?.status === 401) {
          const isRefresh = originalRequest?.url?.includes(
            "account/TokenRefresh/"
          );
          if (isRefresh) {
            JwtService.destroyAccess();
            JwtService.destroyRefresh();
            await router.push({ name: "PAuth" });
            return;
          }
          if (originalRequest) {
            const newToken = await this.refreshToken(
              ApiService.vueInstance?.axios
            );
            if (newToken && originalRequest?.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return ApiService.vueInstance?.axios(originalRequest);
            } else {
              return Promise.reject(error);
            }
          }
        }
        if (errorResponse?.status === 404) {
          await router.replace({ name: "404" });
        }
        return Promise.reject(error);
      }
    );
  }
  static setHeader() {
    ApiService.vueInstance.axios.defaults.headers.common["Authorization"] =
      JwtService.getToken() ? `Bearer ${JwtService.getToken()}` : undefined;
    ApiService.vueInstance.axios.defaults.headers.common["Accept-Language"] =
      localStorage.getItem("locale") || "ru";
  }
  static unsetHeader() {
    ApiService.vueInstance.axios.defaults.headers.common["Authorization"] = ``;
  }
  static query(resource, params) {
    return ApiService.vueInstance?.axios.get(resource, params);
  }
  static get(resource, slug = "") {
    return ApiService.vueInstance?.axios.get(`${resource}/${slug}`);
  }
  static post(resource, data, params) {
    return ApiService.vueInstance?.axios.post(`${resource}`, data, params);
  }
  static update(resource, slug, data, params) {
    return ApiService.vueInstance?.axios.put(
      `${resource}/${slug}`,
      data,
      params
    );
  }
  static put(resource, data, params) {
    return ApiService.vueInstance?.axios.put(`${resource}`, data, params);
  }
  static patch(resource, data, params) {
    return ApiService.vueInstance?.axios.patch(`${resource}`, data, params);
  }
  static delete(resource, params) {
    return ApiService.vueInstance?.axios.delete(`${resource}`, { params });
  }
}
export default ApiService;
//# sourceMappingURL=ApiService.js.map
