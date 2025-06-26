    
"use strict";

 Vue.component(
    'guess-word', {

    data() {
        return {
        };
    },
    props:
    {
        myRowProp: {
            type: Number,
            required: true,
        },
        answerProp: {
            type: String,
            required: true,
        },
        wordProp: {
            type: String,
            required: true,
        },
        activeRowProp: {
            type: Number,
            required: true,
        },
    },

    computed: {
        reveal() {
            return this.activeRowProp > this.myRowProp;
        },
        latestReveal() {
            return this.activeRowProp === this.myRowProp + 1;
        },
        haveFocus() {
            return this.activeRowProp === this.myRowProp;
        },
    },
    template: `
    <div class='guess-row row' :class="{ focus: haveFocus, reveal: reveal, 'latest-reveal': latestReveal, }">
        <div v-for="col in 5" :key='col' class='letter-container'
            :class="{ focus: haveFocus && col - 1 === wordProp.length }">
            <guess-letter :letterProp="wordProp.charAt(col - 1)" :columnProp="col - 1" :answerProp="answerProp" />
        </div>
    </div>
    `,
});
