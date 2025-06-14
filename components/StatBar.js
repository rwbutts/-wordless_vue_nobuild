"use strict";

Vue.component(
    'statbar', {

     data  () {
          return { 
          };
     },

     props: {
          percent : {
               type : Number,
               required : true,
          },
          caption : {
               type : String,
               required : false,
               default : '',
          },
     },

     computed: {
          barCount() {
               return Math.floor( ( this.percent + 5) / 10 );
          }
     },
     template: `
     <div class='box-bar'>
        <div class='box-caption1'>{{ caption }}</div>
        <div class='box-caption2'>{{ (isNaN(percent) ? '--' : percent) }}&percnt; </div>
        <div v-for="i in 10"  class='box' :class='{filled : i <= barCount}' :key='i'></div>
        </div>
     `,
});
