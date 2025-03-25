import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/live-stream",
    name: "PLiveStream",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/LiveStream/pages/PLiveStream.vue"),
  },
  {
    path: "/live-stream/create",
    name: "LiveStreamCreate",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/LiveStream/pages/PLiveStreamCreate.vue"),
  },
];

export default routes;
