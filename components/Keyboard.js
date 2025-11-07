Vue.component(
    'keyboard', {

    data() {
        return {
        };
    },
    methods: {
        onKey(e) {
            this.$emit('keypress', e );
        },
    },
    template: `
    <div class='keyboard'>
        <div class='kb-row'>
            <key char='Q' @keypress="onKey" />
            <key char='W' @keypress="onKey" />
            <key char='E' @keypress="onKey" />
            <key char='R' @keypress="onKey" />
            <key char='T' @keypress="onKey" />
            <key char='Y' @keypress="onKey" />
            <key char='U' @keypress="onKey" />
            <key char='I' @keypress="onKey" />
            <key char='O' @keypress="onKey" />
            <key char='P' @keypress="onKey" />
        </div>
        <div class='kb-row'>
            <key char='A' @keypress="onKey" />
            <key char='S' @keypress="onKey" />
            <key char='D' @keypress="onKey" />
            <key char='F' @keypress="onKey" />
            <key char='G' @keypress="onKey" />
            <key char='H' @keypress="onKey" />
            <key char='J' @keypress="onKey" />
            <key char='K' @keypress="onKey" />
            <key char='L' @keypress="onKey" />
        </div>
        <div class='kb-row'>
            <key char='DELETE' :controlKey="true" label='DELETE'  @keypress="onKey"/>
            <key char='Z' @keypress="onKey" />
            <key char='X' @keypress="onKey" />
            <key char='C' @keypress="onKey" />
            <key char='V' @keypress="onKey" />
            <key char='B' @keypress="onKey" />
            <key char='N' @keypress="onKey" />
            <key char='M' @keypress="onKey" />
            <key char='ENTER' :controlKey="true" label='ENTER' @keypress="onKey" />
        </div>
        <div class='kb-row'>
            <key char='RESET' :controlKey="true" label='PLAY AGAIN' @keypress="onKey"  />
        </div>
    </div>
    `,
});

