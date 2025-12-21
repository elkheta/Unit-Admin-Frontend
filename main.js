import { createApp } from 'vue';
import App from './App.vue';
import apolloClient from './src/apollo.js';

const app = createApp(App);

// Provide Apollo client to the app
app.provide('apollo', apolloClient);

app.mount('#app');

