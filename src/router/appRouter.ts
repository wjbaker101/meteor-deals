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
        {
            path: '/login',
            component: () => import('@/view/LoginView.vue'),
        },
        {
            path: '/user',
            component: () => import('@/view/UserView.vue'),
        },
        {
            path: '/user/create',
            component: () => import('@/view/UserCreateView.vue'),
        },
    ],
});

export const appRouter = router;
