if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/jatsapp/sw.js', { scope: '/jatsapp/' })})}