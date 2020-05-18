<template>
    <div class="admin-view">
        <div class="view-content">
            <h1>Admin</h1>
            <hr>
            <h2>Deal Controls</h2>
            <p>
                <ButtonComponent @click="sendTestCategory" :isLoading="isTestDealLoading">Send Test Deal</ButtonComponent>
            </p>
            <ErrorContainerComponent
                v-if="testDealError"
                :message="testDealError"
            />
            <hr>
            <h2>Latest Sent Notification</h2>
            <LoadingComponent
                v-if="isLatestNotificationLoading"
                :message="`Loading Latest Notification`"
            />
            <div v-else-if="latestNotification === null">
                No Latest Notification
            </div>
            <div v-else>
                <p>
                    <strong>Date &amp; Time:</strong>
                    {{ latestNotificationDateText }}
                </p>
                <p>
                    <strong>Pool size:</strong>
                    {{ latestNotification.dealIDs.length }}
                </p>
                <strong>Email Addresses:</strong>
                <ul>
                    <li :key="`latestNotificationEmail-${emailAddress}`" v-for="emailAddress in latestNotification.results.map(r => r.emailAddress)">{{ emailAddress }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { Route } from 'vue-router';
    import { User as FirebaseUser } from 'firebase/app';

    import { API } from '@/api/API';
    import { DateFormatter } from '@/util/DateFormatter';
    import { EventService, Event } from '@/service/EventService';
    import { FirebaseClient } from '@/api/FirebaseClient';

    import ButtonComponent from '@/component/ButtonComponent.vue';
    import ErrorContainerComponent from '@/component/ErrorContainerComponent.vue';
    import LoadingComponent from '@/component/LoadingComponent.vue';

    import { NotifierResult } from '@common/model/NotifierResult';

    Component.registerHooks([
        'beforeRouteEnter',
    ]);

    @Component({
        components: {
            ButtonComponent,
            ErrorContainerComponent,
            LoadingComponent,
        },
    })
    export default class AdminView extends Vue {

        private isTestDealLoading: boolean = false;
        private testDealError: string = '';

        private latestNotification: NotifierResult | null = null;
        private isLatestNotificationLoading: boolean = false;

        get latestNotificationDateText() {
            if (this.latestNotification === null) {
                return '';
            }

            const date = new Date(this.latestNotification.timestamp);
            return DateFormatter.formatDate(date);
        }

        beforeRouteEnter(
                to: Route,
                from: Route,
                next: any) {

            next((vm: Vue) => {
                if (vm.$store.state.user === null) {
                    next('/login');
                }
                else {
                    next();
                }
            });
        }

        async mounted(): Promise<void> {
            if (await FirebaseClient.getUserToken() !== null) {
                await this.loadSettings();
            }
            else {
                EventService.$on(Event.USER_AVAILABLE, async (user: FirebaseUser | null) => {
                    await this.loadSettings();
                });
            }
        }

        async loadSettings(): Promise<void> {
            this.loadLatestNotification();
        }

        async loadLatestNotification(): Promise<void> {
            this.isLatestNotificationLoading = true;

            const result = await API.getLatestNotification();

            if (result instanceof Error) {
                this.isLatestNotificationLoading = false;
                console.log(result)
                return;
            }

            this.latestNotification = result;

            this.isLatestNotificationLoading = false;
        }

        async sendTestCategory(): Promise<void> {
            this.isTestDealLoading = true;
            this.testDealError = '';

            const newDeal = await API.addDeal({
                id: '',
                title: 'Test Deal',
                startDate: new Date(),
                endDate: new Date(Date.now() + 1000 * 60),
                description: 'Test deal description.',
                categories: ['Category1', 'Category2', 'Category3'],
                url: '#',
                isHot: true,
            });

            if (newDeal instanceof Error) {
                console.log(newDeal);
                this.testDealError = 'Error occured during creation stage, see console for details.';
            }
            else {
                const deletionResult = await API.deleteDeal(newDeal.id);

                if (deletionResult instanceof Error) {
                    console.log(deletionResult);
                    this.testDealError = 'Error occured during deletion stage, see console for details.';
                }
            }

            this.isTestDealLoading = false;
        }
    }
</script>

<style lang="scss">
    .admin-view {

        .view-content {
            max-width: 720px;
            margin: 0 auto;
        }
    }
</style>
