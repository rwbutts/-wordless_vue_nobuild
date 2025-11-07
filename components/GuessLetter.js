"use strict";

Vue.component(
    'guess-letter', {

    data() {
        return {
        };
    },
    props: {
        'letterProp': {
            type: String,
            required: true,
        },
        'answerProp': {
            type: String,
            required: true,
        },
        'columnProp': {
            type: Number,
            required: true,
        },
        
    },
    computed: {
        letterColor() {
            return (this.letterProp === this.answerProp.charAt(this.columnProp )) 
            ? MatchCodes.CORRECT 
            : (this.answerProp.includes(this.letterProp) ? MatchCodes.ELSEWHERE : MatchCodes.MISS);
        }
    },
    template: `
        <div class='guess-letter' :class="{ [letterColor]: true }">
            <div class='front'>
                {{ letterProp }}
            </div>
            <div class='back '>
                {{ letterProp }}
            </div>
        </div>
    `,
});
