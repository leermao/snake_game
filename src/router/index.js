import Vue from "vue";
import VueRouter from "vue-router";
import Game from "../views/Game.vue";
import Leaderboard from "../views/Leaderboard.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "game",
    component: Game,
  },
  {
    path: "/leaderboard",
    name: "leaderboard",
    component: Leaderboard,
  },
  {
    path: "*",
    redirect: "/",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes,
});

export default router;
