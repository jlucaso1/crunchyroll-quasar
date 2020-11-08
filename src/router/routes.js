const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") },
      { path: "list", component: () => import("pages/List.vue") },
      { path: "catalog", component: () => import("pages/Index.vue") },
      { path: "simulcasts", component: () => import("pages/Index.vue") },
      { path: "settings", component: () => import("pages/Settings.vue") }
    ]
  },
  {
    path: "/series/",
    component: () => import("layouts/Secondary.vue"),
    children: [
      {
        path: ":id",
        component: () => import("pages/Anime.vue")
      }
    ]
  },
  {
    path: "/watch/",
    component: () => import("layouts/Secondary.vue"),
    children: [
      {
        path: ":id",
        component: () => import("pages/Episode.vue")
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
