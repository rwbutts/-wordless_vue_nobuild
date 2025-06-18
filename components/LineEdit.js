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
                        const resp = await WordlessApiService.checkWordAsync(this.editWord);
                        switch (resp.exists) {
                            case false:
                                if(this.editWord === 'XYZZY') {
                                    this.statusMsg(`Answer: ${this.answer}`, statusMessageClass.ERROR);
                                    newEditWord = "";
                                } else {
                                    this.statusMsg(`Sorry, ${this.editWord} is not in my dictionary!`, statusMessageClass.ERROR);
                                    newEditWord = "";
                                }
                                break;
                            case true:
                                // Word is valid.  Process the accepted guethis.
                                this.$emit('validated', { word: this.editWord });
                                newEditWord = '';
                                break;
                            case undefined:
                                this.statusMsg(`Error validating word: ${resp.message}. Try again in a few moments.`, statusMessageClass.ERROR);
                                break;
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
