import Vue from 'vue';
import VueRouter from 'vue-router';

import DealsView from '@/view/DealsView.vue';

Vue.use(VueRouter);

const router = new VueRouter({

    mode: 'history',

    routes: [
        {
            path: '/',
            component: DealsView,
        },
        {
            path: '/new-deal',
            component: () => import('@/view/NewDealView.vue'),
        },
    ],
});

export const appRouter = router;
