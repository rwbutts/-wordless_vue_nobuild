"use strict";
const WIN_MESSAGE="Congratulations, you got it! Please hire me!";
const LOSE_MESSSAGE="Sorry, the answer is #ARG0#";
const REMAINING_WORD_MESSAGE="#ARG0# remaining word(s) match the clues above";
const LOADING_MESSAGE="Loading ...";
const LOADED_MESSAGE="Guess the 5-letter word in 6 tries. Good luck!";

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
            statusMessage: LOADING_MESSAGE,
            statusMessageClass: statusMessageClass.DEFAULT,
            gameMode: GameModes.EASY,
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
        statusMsg(msg, msgClass = statusMessageClass.DEFAULT) {
            this.statusMessage = msg;
            this.statusMessageClass = msgClass;
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
        async onValidate(e) {
            let resp;
            if( this.gameMode === GameModes["EXTRA-HARD"])  {
                resp = await WordlessApiService.checkWordAsync(this.editWord, this.answer, this.guesses);
            } else {
                resp = await WordlessApiService.checkWordAsync(this.editWord, this.answer);
            }
            e.message = resp.message
            e.valid = resp.valid;
            e.resolve();
        },
        async onValidated(e) {
            this.guesses.push(e.word);
            this.setKeyColorsFromGuess(e.word);
            switch (true) {
                case e.word === this.answer:
                    this.gamePlayState = GamePlayStates.WON;
                    this.statusMsg(WIN_MESSAGE, statusMessageClass.WIN);
                    this.onGameOver({ won: true, guesses: this.nGuesses });
                    break;
                case this.guesses.length >= 6:
                    this.gamePlayState = GamePlayStates.LOST;
                    this.statusMsg(LOSE_MESSSAGE.replace('#ARG0#', this.answer), statusMessageClass.LOSE);
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
            if(key === KeyCodes.ALL) {
                Object.keys(keyRefMap).forEach( k => keyRefMap[k].setKeyColor(color));
            } else{
                keyRefMap[key].setKeyColor( color );
            }
        },
        resetState() {
            this.guesses = [];
            this.setKeyColor(KeyCodes.ALL, MatchCodes.DEFAULT);
            this.gamePlayState = GamePlayStates.PLAYING;
        },
        // @typescript-eslint-disable-next-line no-unused-vars
        async triggerWordLoad() {
            this.statusMsg("Loading ...");
            const response = await WordlessApiService.getWordAsync();
            if (response.success) {
                this.answer = response.word?.toUpperCase();
                this.resetState();
                this.apiVersion = response.api_version ?? 'n/a';
                this.statusMsg(LOADED_MESSAGE, statusMessageClass.WELCOME);
            }
            else {
                this.statusMsg(`Error: ${response.message}. Refresh page to retry.`, statusMessageClass.ERROR);
            }
        },
        async displayMatchingWordCount(answer, guesses) {
            const resp = await WordlessApiService.getMatchCountAsync(answer, guesses);
            if (!resp.success) {
                this.statusMsg(`Error: ${resp.message}`, statusMessageClass.ERROR);
            } else {
                this.statusMsg(REMAINING_WORD_MESSAGE.replace('#ARG0#', resp.count));
            }
        },
        onGameOver(e) {
            this.$refs['stats'].onGameOver(e);
        },

    },
    template: `
        <div id="game-container" class='disable-tap-zoom dbg-red' 
            :class="{ 'modal-active': statModalIsActive, [gamePlayState]: true, 'enable-hard-mode': gameMode !== 'easy', }">
            <stats :isActive.sync='statModalIsActive' ref='stats' />
            <div id="game-content">
                <div class="title">Wordless</div>
                <div class="subtitle">Bill's Word Game in Vue</div>
                <div id="game-ui" class="dbg-blue">
                    <div>
                        <guess-word v-for="row in 6" :key="row" :wordProp="rowWord(row)" :answerProp="answer"
                            :myRowProp="row - 1" :activeRowProp='nGuesses'>
                        </guess-word>
                    </div>
                    <div class='status-area'>
                        <h3 class='status ' :class="{[statusMessageClass]: statusMessageClass!=='' }"> {{ statusMessage }}</h3>
                    </div>
                    <line-edit :editWord.sync="editWord" :answer="answer" @validate="onValidate" @validated="onValidated" 
                            @message="statusMsg" @key="statusMsg('')" @reset="triggerWordLoad" />
                </div>
                <div class='footer dbg-red'>
                    <label class='hard-checkbox'>
                        <input type="radio" value="easy" v-model="gameMode" /> Easy
                    </label>
                    <label class='hard-checkbox'>
                        <input type="radio" value="hard" v-model="gameMode" /> Hard
                    </label>
                    <label class='hard-checkbox'>
                        <input type="radio" value="extra-hard" v-model="gameMode" /> Extra Hard
                    </label>
                    <br />
                    <b>Hard Mode:</b> grey letters cannot be reused
                    <br />
                    <b>Extra Hard Mode:</b> guesses must respect ALL previous clues
                    <hr>
                    <div class="color-code-guide">
                        <div class='correct'>Green: correct</div>
                        <div class='elsewhere'>Yellow: another position</div>
                        <div class='miss'>Grey: not in word</div>
                    </div>
                    <span class='version-info'>
                        app_ver: {{ appVersion }}
                        <span v-if="apiVersion !== ''">, api_ver: {{ apiVersion }} </span>
                    </span>
                </div>
            </div>
        </div>
    `,
});
