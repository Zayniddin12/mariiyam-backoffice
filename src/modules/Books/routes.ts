import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/books",
    name: "Books",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Books/pages/PIndex.vue"),
  },
  {
    path: "/books/:id",
    name: "BooksSingle",
    redirect: { name: "BooksSingleAbout" },
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Books/pages/Single/PIndex.vue"),
    children: [
      {
        path: "/books/:id/about",
        name: "BooksSingleAbout",
        meta: {
          layout: "default",
        },
        component: () =>
          import("@/modules/Books/pages/Single/Children/PSingleAbout.vue"),
      },
      {
        path: "/books/:id/sales",
        name: "BooksSingleSales",
        meta: {
          layout: "default",
        },
        component: () =>
          import("@/modules/Books/pages/Single/Children/PSingleSales.vue"),
      },
    ],
  },
  {
    path: "/books/create",
    name: "BooksCreate",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Books/pages/PCreate.vue"),
  },
  {
    path: "/books/:id/edit",
    name: "BooksEdit",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Books/pages/PEdit.vue"),
  },
];

export default routes;
