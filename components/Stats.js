"use strict";

Vue.component(
    "stats", {

    data() {
        return {
            cumStats: new CumulativeStats(),
            showDialog: false,
        };
    },
    props: {
        isActive: {
            type: Boolean,
            required: true,
        }
    },
    methods: {
        histogramPct(NTries) {
            return Math.floor((this.cumStats.histogramBins[NTries - 1] / this.cumStats.gamesWon) * 100 + 0.5);
        },
        closeDialog() {
            this.showDialog = false;
            this.$emit("update:isActive", false);
        },
        handleKey(e) {
            if (this.showDialog && (e.key === "Enter" || e.key === "Escape"))
                this.closeDialog();
        },
        recordResultAndShowModal(evt) {
            let newStats;
            if (evt.won) {
                assert(!(evt.guesses === undefined), "newVal.numGuesses is not undefined");
                newStats = CumulativeStats.recordWin(evt.guesses);
            }
            else {
                newStats = CumulativeStats.recordLoss();
            }

            this.cumStats = Object.assign({}, this.cumStats, newStats);
            this.$emit("update:isActive", true);

            this.showDialog = true;
        },
    },
    computed: {
        winPct: function () {
            return Math.floor((this.cumStats.gamesWon / this.cumStats.gamesPlayed) * 100 + 0.5);
        },

        lossPct: function () {
            return Math.floor(((this.cumStats.gamesPlayed - this.cumStats.gamesWon) / this.cumStats.gamesPlayed) * 100 + 0.5);
        }
    },

    mounted() {
        window.addEventListener("keydown", this.handleKey.bind(this));
    },
    template: `
        <div class="stat-box" :class="{ 'show-dialog': showDialog }">
        <h1 class="title">Cumulative Statistics</h1>
        <h2 class="subtitle">Words Guessed</h2>
        <statbar class="bar-guessed-pct" :percent="winPct" :caption="cumStats.gamesWon.toString()" />

        <h2>Guesses Required</h2>
        <statbar class="bar-guesses-required" v-for="i in 6" :percent="histogramPct(i)" :caption="i.toString()"
            :key="i" />

        <h2 class="subtitle">Words Missed</h2>
        <statbar class="bar-missed-pct" :percent="lossPct"
            :caption="(cumStats.gamesPlayed - cumStats.gamesWon).toString()" />

        <h2 class="subtitle">Winning streak: {{ cumStats.winningStreak }} in a row</h2>

        <div class="close-button">
            <!-- <a @click="Hide();">&#x2716;</a> -->
            <button class="close-button enabled" @click="closeDialog();" @keyup.enter="closeDialog">
                Close
            </button>
        </div>
    </div>
    `,
});
