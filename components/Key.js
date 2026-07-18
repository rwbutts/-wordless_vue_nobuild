"use strict";

Vue.component(
    "key", {
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
            return "key-"+this.char.toLowerCase();
        },
    },

    methods:
    {
        clickHandler() {
            /**                
             * check if disabled in css so keypress-
             * calls are ignored (native click will be disabled by css setting .)
             **/
            if ("none" !== window.getComputedStyle(this.$el).getPropertyValue("pointer-events")) {
                this.keyDown = true;
                this.$emit("keypress", {key: this.char });
                setTimeout(() => (this.keyDown = false), 100);
            }
        },
        handleKeyboardKey(evt) {
            let keyTranslated = evt.key==="Backspace" ? "DELETE": evt.key.toUpperCase();
            if (keyTranslated  === this.char) {
                this.clickHandler();
            }
        },
        
        setKeyColorEventHandler(key, color) {
            if( key === KeyCodes.ALL || key.toUpperCase() === this.char.toUpperCase() ) {
                // If current color is Green, don"t honor a change back to Yellow
                if( !(this.color === MatchCodes.CORRECT && color === MatchCodes.ELSEWHERE)) {
                    this.color = color;
                }
            }
        }
    },

    mounted() {
        this.$root.$on("set-key-color", this.setKeyColorEventHandler);
        window.addEventListener("keydown", this.handleKeyboardKey.bind(this));
    },
    template: `
        <BUTTON href="#" class="key-button" @click="clickHandler"
        :class="{ [color]: true, [keyNameClass]: true, [controlKey?'nonalpha':'alpha']: true, 'key-down': keyDown,  }">
        {{ label ? label : char }}
        </BUTTON>
    `,
});

