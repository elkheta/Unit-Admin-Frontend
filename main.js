import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import apolloClient from './src/apollo.js';
import { DefaultApolloClient } from '@vue/apollo-composable';
import './index.css';

const app = createApp(App);

// Use router
app.use(router);

// Provide Apollo client to the app
app.provide(DefaultApolloClient, apolloClient);

app.mount('#app');

