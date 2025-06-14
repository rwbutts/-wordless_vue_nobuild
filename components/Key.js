"use strict";

const keyRefMap = {};

Vue.component(
    'key', {
    data() {
        return {
            keyDown: false,
            color: MatchCodes.DEFAULT,
            enabled: false,
        };
    },
    props: {
        label: {
            type: String,
            default: "",
        },

        controlKey: {
            type: Boolean,
            default: false,
        },

        char: {
            type: String,
            required: true,
        },
    },

    computed:
    {
        keyNameClass() {
            return 'key-'+this.char.toLowerCase();
        },
    },

    methods:
    {
        clickHandler() {
            /**                
             * check if disabled in css so keypress-
             * calls are ignored (native click will be disabled by css setting .)
             **/
            if ('none' !== window.getComputedStyle(this.$el).getPropertyValue('pointer-events')) {
                this.keyDown = true;
                this.$emit('key', {key: this.char });
                setTimeout(() => (this.keyDown = false), 100);
            }
        },
        handleKeyboardKey(e) {
            let keyTranslated = e.key==='Backspace' ? 'DELETE': e.key.toUpperCase();
            if (keyTranslated  === this.char) {
                this.clickHandler();
            }
        },
        
        setKeyColor( color) {
            this.color = color;
        }
    },

    mounted() {
        keyRefMap[this.char] = this;
        window.addEventListener('keydown', this.handleKeyboardKey.bind(this));
    },
    template: `
        <BUTTON href='#' class='key-button' @click="clickHandler"
        :class="{ [color]: true, [keyNameClass]: true, [controlKey?'nonalpha':'alpha']: true, 'key-down': keyDown,  }">
        {{ label ? label : char }}
        </BUTTON>
    `,
});

