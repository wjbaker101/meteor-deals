import Vue from 'vue';

import App from '@/App.vue';
import { appRouter as router } from '@/router/appRouter';
import { appStore as store } from '@/store/appStore';

import '@/registerServiceWorker';

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App),

    beforeCreate() {
        this.$store.commit('init');
    },
})
.$mount('#app');
