import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/transactions",
    name: "PTransactions",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Transactions/pages/PTransactions.vue"),
  },
];

export default routes;
