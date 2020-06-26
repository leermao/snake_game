<template>
  <div class="row">
    <Row :gutter="5" style="width: 100%" type="flex" justify="center">
      <Col span="14">
        <div class="column game">
          <div class="greeting align-center" v-if="!gameStarted">
            <h1>欢迎开始贪吃蛇</h1>
            <p>请按下开始键</p>
          </div>

          <div id="stage"></div>

          <transition name="fade">
            <div
              class="finished-game-popup shadow align-center"
              v-if="gamePaused"
            >
              <h4>游戏暂停</h4>
            </div>
            <div
              class="finished-game-popup shadow align-center"
              v-if="lastGame.finished"
            >
              <h4>游戏结束</h4>
              <p>
                您的得分是<br /><span>{{ lastGame.lastScore }}</span>
              </p>
            </div>
            <div class="finished-game-popup shadow align-center" v-if="gameWon">
              <h4>你赢了!</h4>
              <p>
                您的得分是<br /><span>{{ lastGame.lastScore }}</span>
              </p>
            </div>
          </transition>
        </div>
      </Col>

      <Col span="6">
        <div class="column sidebar-wrapper">
          <div class="sidebar align-center align-items-center">
            <h2>得分: <span id="score">0</span></h2>

            <button @click="startGame">开始</button><br />
            <transition name="scale">
              <div
                v-if="gameStarted && !lastGame.finished"
                style="margin-top: 5px"
              >
                <button @click="pauseGame" v-if="isPlaying">暂停</button>
                <button @click="resumeGame" v-if="!isPlaying">
                  继续
                </button>
              </div>
            </transition>

            <h2>设置</h2>
            <label for="difficulty">难度： {{ difficulty }}</label>
            <Slider
              id="difficulty"
              :min="5"
              :max="50"
              v-model="difficulty"
            ></Slider>

            <h2>键位</h2>
            <div class="controls">
              <div class="row">
                <div class="column align-center">
                  <img
                    src="@/assets/img/Up.png"
                    :class="{ pressed: isUpButtonPressed }"
                    @click="buttonPressed(38)"
                  />
                </div>
              </div>
              <div class="row">
                <div class="column align-center">
                  <img
                    src="@/assets/img/Left.png"
                    :class="{ pressed: isLeftButtonPressed }"
                    @click="buttonPressed(37)"
                  />
                  <img
                    src="@/assets/img/Down.png"
                    :class="{ pressed: isDownButtonPressed }"
                    style="margin:0 7px"
                    @click="buttonPressed(40)"
                  />
                  <img
                    src="@/assets/img/Right.png"
                    :class="{ pressed: isRightButtonPressed }"
                    @click="buttonPressed(39)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import Game from "@/components/Game/Game.js";

export default {
  name: "game",

  data() {
    return {
      game: null,
      difficulty: 10,
      isPlaying: false,
      gameStarted: false,
      gamePaused: false,
      isLeftButtonPressed: false,
      isUpButtonPressed: false,
      isRightButtonPressed: false,
      isDownButtonPressed: false,
    };
  },

  computed: {
    lastGame() {
      return {
        finished: this.$store.getters.finishedGame.finished,
        lastScore: this.$store.getters.finishedGame.score,
      };
    },

    gameWon() {
      return this.$store.getters.gameWon;
    },
  },

  methods: {
    startGame() {
      this.removePreviousCells();

      this.game = new Game(24, 24, 24, this.difficulty);

      this.gameStarted = true;
      this.isPlaying = true;
      this.gamePaused = false;

      this.$store.dispatch("TOGGLE_GAME", { finished: false, score: 0 });
      this.$store.dispatch("WIN_GAME", false);
    },

    pauseGame() {
      this.isPlaying = this.game.finishLoop();
      this.gamePaused = true;
    },

    resumeGame() {
      this.isPlaying = this.game.startLoop();
      this.gamePaused = false;
    },

    buttonPressed(key) {
      // Control snake if game started
      if (this.gameStarted) {
        this.game.snake.controller(key);
      }

      let button = "";

      if (key === 37) {
        button = "Left";
      }
      if (key === 38) {
        button = "Up";
      }
      if (key === 39) {
        button = "Right";
      }
      if (key === 40) {
        button = "Down";
      }

      // Button animation
      this[`is${button}ButtonPressed`] = true;
      setTimeout(() => {
        this[`is${button}ButtonPressed`] = false;
      }, 200);
    },

    removePreviousCells() {
      if (this.game !== null) {
        const stage = this.game.stage;

        while (stage.hasChildNodes()) {
          stage.removeChild(stage.lastChild);
        }
      }
    },
  },

  created() {
    window.addEventListener("keydown", e => {
      this.buttonPressed(e.keyCode);
    });
  },
};
</script>

<style lang="scss">
.game {
  position: relative;
  height: 100%;

  .greeting {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
  }

  #stage {
    position: relative;
    margin: 0 auto;

    .cell {
      position: absolute;
      transition: all 0.1s;
      background-color: #fff;

      &.filled {
        @include cell-image("../assets/img/Clone.png");
        transform: scale($scale-coef);

        &.food {
          @include cell-image("../assets/img/Planet-2.png");
          transform: scale(1);
        }

        &.head {
          @include cell-image("../assets/img/Darth-Vader.png");
          transform: scale(1);
        }
      }
    }

    .back-cell {
      @extend .cell;
    }
  }
}

.column.sidebar-wrapper {
  padding: 20px 10px;
  background: #fff;

  .sidebar {
    height: 100%;

    h2 {
      margin: 40px 0 10px;

      &:first-child {
        margin-top: 0;
      }
    }

    input[type="range"] {
      margin-bottom: 0;
    }

    .instruction {
      margin-bottom: 10px;
    }

    .controls {
      img {
        display: inline-block;
        width: 38px;
        padding: 7px;
        background: $gradient-primary;
        border-radius: $radius-primary;
        transition: $transition-primary;
        cursor: pointer;

        &.pressed {
          transform: scale($scale-coef);
          background: $gradient-secondary;
        }
      }
    }
  }
}

.finished-game-popup {
  position: absolute;
  margin: 0 auto;
  top: 230px;
  left: 298px;
  transform: translateX(-50%);
  z-index: 2;
  padding: 20px;
  background-color: #fff;

  h4,
  p {
    margin-bottom: 0;
  }

  span {
    @include gradient-text($gradient-secondary);
    font-weight: 700;
    font-size: 20px;
  }
}

button:active {
  transform: scale($scale-coef);
  background: $gradient-secondary;
}
</style>
