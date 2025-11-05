"use strict";

Vue.component(
    'line-edit', {

    data() {
        return {
            cursorColumn: 0,
        };
    },
    props: {
        editWord: {
            type: String,
        },
        answer: {
            type: String,
        },
    },
    methods:
    {
        async onKey(e){
            const key = e.key;
            this.$emit('key', e);

            const L = this.editWord.length;
            let newEditWord = this.editWord;

            switch (true) {
                case key === KeyCodes.ENTER && L >= 5:
                    {
                        // if cheat code enabled and is used, just force a message and reset the edit word
                        if( APP_CHEAT_CODE !== "null" && this.editWord.toLowerCase() === APP_CHEAT_CODE ) 
                        {
                            newEditWord='';
                            this.$emit('message', `The answer is ${this.answer.toUpperCase()}`, statusMessageClass.WELCOME );
                            break;
                        }

                        // no cheat code, do actual validtion logic
                        let validateEvt = {word: this.editWord, valid: undefined, message: undefined, resolve: undefined,   };
                        let promise = new Promise( (resolve, reject) => {
                                validateEvt.resolve = resolve;
                                this.$emit('validate', validateEvt);
                            })
                        await promise;
                        if(validateEvt.valid) {
                                this.$emit('validated', { word: this.editWord });
                                newEditWord = '';
                        } else {
                            newEditWord='';
                            this.$emit('message', validateEvt.message, statusMessageClass.ERROR );
                        }
                    }
                    break;
                case key === KeyCodes.DELETE && L > 0:
                    newEditWord = this.editWord.substring(0, L - 1);
                    break;
                case key.length === 1 && key >= 'A' && key <= 'Z' && L < 5:
                    newEditWord += key;
                    break;
                case key === 'RESET':
                    this.$emit('reset');
                    break;
            }

            if(newEditWord !== this.editWord)
            {
                this.$emit('update:editWord', newEditWord);
            }

        },
        statusMsg( msg, msgClass=statusMessageClass.DEFAULT ) {
            this.$emit('message', msg, msgClass );
        },
    },
    template: `
        <keyboard :class="{ enable_delete: (editWord.length >= 1), enable_enter: (editWord.length >= 5), }" @key="onKey" />
    `,

});
