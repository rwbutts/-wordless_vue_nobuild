new Vue({
  el: '#root'
});

if( isPWA() ) {
    console.log("Running as PWA");
} else {
    console.log("Running as Standalone");
}
