<template>
  <div id="#app">
    <topbar></topbar>

    <main>
      <transition :name="transitionName" mode="out-in" appear>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </main>
  </div>
</template>

<script>
import Topbar from "./components/Topbar";

export default {
  components: {
    Topbar,
  },

  computed: {
    transitionName() {
      return this.$route.path === "/" ? "slide-right" : "slide-left";
    },
  },
};
</script>

<style lang="scss">
main {
  padding: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active {
  animation: scale-in 0.3s;
}
.scale-leave-active {
  animation: scale-out 0.3s;
}
@keyframes scale-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes scale-out {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}

.slide-left-enter-active {
  transition: all 0.3s;
}
.slide-left-enter {
  transform: translateX(50px);
  opacity: 0;
}

.slide-right-enter-active {
  transition: all 0.3s;
}
.slide-right-enter {
  transform: translateX(-50px);
  opacity: 0;
}
</style>
