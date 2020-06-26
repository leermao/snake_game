<template>
  <transition name="fade">
    <div class="leaderboard align-center">
      <h1>排行榜</h1>

      <div v-if="scores.length > 0">
        <Table :columns="columns" :data="scores"></Table>
      </div>

      <h2 v-else>暂无得分.<br />请开始游戏!</h2>
    </div>
  </transition>
</template>

<script>
export default {
  name: "leaderboard",

  data() {
    return {
      columns: [
        {
          type: "index",
          width: 60,
          align: "center",
        },
        {
          title: "时间",
          render: (h, cxt) => {
            return h("div", {}, this.formattedDate(cxt.row.date));
          },
        },
        {
          title: "得分",
          render: (h, cxt) => {
            return h("div", {}, cxt.row.score);
          },
        },
      ],
    };
  },

  computed: {
    scores() {
      return this.$store.getters.allScores;
    },
  },

  methods: {
    formattedDate(dateString) {
      return new Date(dateString).toLocaleString();
    },
  },
};
</script>

<style scoped lang="scss">
.leaderboard {
  width: 100%;
}
</style>
