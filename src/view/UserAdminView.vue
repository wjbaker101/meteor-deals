<template>
    <div class="admin-view">
        <div class="view-content">
            <h1>Admin</h1>
            <h2>Send Test Deal</h2>
            <p>
                <ButtonComponent>Send</ButtonComponent>
            </p>
            <ErrorContainerComponent :message="testDealError" />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { Route } from 'vue-router';

    import { API } from '@/api/API';

    import ButtonComponent from '@/component/ButtonComponent.vue';
    import ErrorContainerComponent from '@/component/ErrorContainerComponent.vue';

    Component.registerHooks([
        'beforeRouteEnter',
    ]);

    @Component({
        components: {
            ButtonComponent,
            ErrorContainerComponent,
        },
    })
    export default class AdminView extends Vue {

        private isTestDealLoading: boolean = false;
        private testDealError: string = '';

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
