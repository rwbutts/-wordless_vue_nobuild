"use strict";

Vue.component(
    'game-container', {
    data() {
        return {
            guesses: [],
            editWord: '',
            gamePlayState: GamePlayStates.LOADING_WORD,
            answer: '',
            statModalIsActive: false,
            appVersion: APP_VERSION,
            apiVersion: '',
            statusMessage: 'Loading ...',
            enableHardMode: false,

        };
    },
    computed: {
        nGuesses() {
            return this.guesses.length;
        },
    },
    mounted() {
        setTimeout(() => this.triggerWordLoad(), 2000);
    },
    methods: {
        statusMsg(msg) {
            this.statusMessage = msg;
        },
        rowWord(row) {
            if (row - 1 === this.nGuesses) {
                return this.editWord;
            } else if (row - 1 < this.nGuesses) {
                return this.guesses[row - 1];
            } else {
                return '';
            }
        },
        async onValidated(e) {
            this.guesses.push(e.word);
            this.setKeyColorsFromGuess(e.word);
            switch (true) {
                case e.word === this.answer:
                    this.gamePlayState = GamePlayStates.WON;
                    this.onGameOver({ won: true, guesses: this.nGuesses });
                    this
                    break;
                case this.guesses.length >= 6:
                    this.gamePlayState = GamePlayStates.LOST;
                    this.onGameOver({ won: false, guesses: this.nGuesses });
                    break;
                default:
                    await this.displayMatchingWordCount(this.answer, this.guesses);
            }
        },
        setKeyColorsFromGuess(guess) {
            for (let i = 0; i < guess.length; i++) {
                const gc = guess.charAt(i);
                const color = (gc === this.answer.charAt(i)) ? MatchCodes.CORRECT : (this.answer.includes(gc) ? MatchCodes.ELSEWHERE : MatchCodes.MISS);
                this.setKeyColor(gc, color);
            }
        },
        setKeyColor(key, color) {
            if(key === '*') {
                Object.keys(keyRefMap).forEach( k => keyRefMap[k].setKeyColor(color));
            } else{
                keyRefMap[key].setKeyColor( color );
            }
        },
        resetState() {
            this.guesses = [];
            this.setKeyColor('*', MatchCodes.DEFAULT);
            this.gamePlayState = GamePlayStates.PLAYING;
        },
        // @typescript-eslint-disable-next-line no-unused-vars
        async triggerWordLoad() {
            this.statusMsg("Loading ...");
            const response = await WordlessApiService.getWordAsync();
            console.log("onTriggerWordLoad: got ", response);
            if (response.success) {
                this.answer = response.word?.toUpperCase();
                this.resetState();
                this.apiVersion = response.api_version ?? 'n/a';
                this.statusMsg('Guess the 5-letter word in 6 tries. Good luck!');
            }
            else {
                this.statusMsg(`Error loading word - ${response.message}. Refresh page to retry.`);
            }
        },
        async displayMatchingWordCount(answer, guesses) {
            const resp = await WordlessApiService.getMatchCountAsync(answer, guesses);
            //console.log("displayMatchingWordCount", answer, guesses, resp,);
            if (!resp.success) {
                this.statusMsg(`Failed to calc remaining: ${resp.message}`);
            } else {
                this.statusMsg(`${resp.count} remaining word(s) match the clues above.`);
            }
        },
        onGameOver(e) {
            this.$refs['stats'].onGameOver(e);
        },

    },
    template: `
        <div id="game-container" class='game-container disable-tap-zoom dbg-red' :class="{ 'modal-active': statModalIsActive, [gamePlayState]: true, 'enable-hard-mode': enableHardMode, }">
            <stats :isActive.sync='statModalIsActive' ref='stats' />
            <!-- <h3 class='title dbg-green'>Bill's NYTimes Wordle</a><sup><small>&trade;</small></sup> Clone</h3> -->
            <h3 class='title dbg-green'>Wordless: Bill's Wordle</a><sup><small>&trade;</small></sup> Clone</h3>
            <div class="dbg-blue">
                <div class='guess-list'>
                    <guess-word v-for="row in 6" :key="row" :wordProp="rowWord(row)" :answerProp="answer"
                        :myRowProp="row - 1" :activeRowProp='nGuesses'>
                    </guess-word>
                </div>
                <div class='status-area'>
                    <h3 class='status status-game-loading'> Loading ...</h3>
                    <h3 class='status status-game-in-progress'> {{ statusMessage }}</h3>
                    <h3 class='status status-game-lost'>Sorry, the answer is {{ answer }}</h3>
                    <h3 class='status status-game-won'>Congratulations, you got it! Please hire me!</h3>
                </div>

                <line-edit :editWord.sync="editWord" @validated="onValidated" @message="statusMsg" @key="statusMsg('')"
                    @reset="triggerWordLoad" />
            </div>
            <div class='footer dbg-red'>
                <label class='hard-checkbox small-text'>
                    <input type="checkbox" v-model="enableHardMode">
                    <b>Hard Mode:</b> when checked, grey letters cannot be reused
                </label>
                <br>
                <br>
                <span class='correct'>Green</span>: correct;
                <span class='elsewhere'>Yellow</span>: wrong position;
                <span class='miss'>Grey</span>: not in word
                <br>
                <span class='small-text version-info'>
                    app_ver: {{ appVersion }}
                    <span v-if="apiVersion !== ''">, api_ver: {{ apiVersion }} </span>
                </span>
            </div>
        </div>
    `,
});
