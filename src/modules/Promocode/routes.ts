import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/promocode",
    name: "Promocode",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Promocode/pages/PIndex.vue"),
  },
  {
    path: "/promocode-create",
    name: "PromocodeCreate",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Promocode/pages/PPromocodeCreate.vue"),
  },
  {
    path: "/promocode-edit/:promocodeId",
    name: "PromocodeEdit",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Promocode/pages/PPromocodeEdit.vue"),
  },
  {
    path: "/promocode/:promocodeId",
    name: "PromocodeSingle",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Promocode/pages/Single/PIndex.vue"),
    children: [],
  },
];

export default routes;
