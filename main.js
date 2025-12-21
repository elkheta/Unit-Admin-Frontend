import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import apolloClient from './src/apollo.js';

const app = createApp(App);

// Use router
app.use(router);

// Provide Apollo client to the app
app.provide('apollo', apolloClient);

app.mount('#app');

