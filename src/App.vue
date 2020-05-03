<template>
    <div id="app" class="flex">
        <HeaderComponent />
        <div class="router-view flex">
            <router-view />
            <FooterComponent />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    import HeaderComponent from '@/component/HeaderComponent.vue';
    import FooterComponent from '@/component/FooterComponent.vue';

    @Component({
        components: {
            HeaderComponent,
            FooterComponent,
        },
    })
    export default class App extends Vue {

    }
</script>

<style lang="scss">
    @import './style/variables';

    @import './style/body';
    @import './style/container';
    @import './style/layout';
    @import './style/button';
    @import './style/input';
    @import './style/icon';
    @import './style/links';

    #app {
        grid-template-columns: var(--nav-width) 1fr;

        @media only screen and (max-width: 50rem) {
            flex-direction: column;
        }
    }

    .router-view {
        flex: 1;
        flex-direction: column;
        overflow-y: auto;
        padding: var(--spacing-small);

        & > :first-child {
            flex: 1;
        }

        @media only screen and (max-width: 50rem) {
            overflow-y: initial;
        }
    }
</style>
