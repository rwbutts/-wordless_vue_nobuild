new Vue({
  el: '#root'
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}


if( isPWA() ) {
    console.log("Running as PWA");
} else {
    console.log("Running as Standalone");
}
