<template>
    <div id="app">
        <HeaderComponent />
        <div class="page flex">
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
    export default class App extends Vue {}
</script>

<style lang="scss">
    @import './style/variables';

    @import './style/blockquote';
    @import './style/body';
    @import './style/button';
    @import './style/container';
    @import './style/heading';
    @import './style/horizontal-line';
    @import './style/icon';
    @import './style/input';
    @import './style/layout';
    @import './style/link';

    .page {
        height: calc(100% - 127px);
        padding: var(--spacing-small);
        flex-direction: column;

        & > * {
            flex: 1;
        }

        .footer-component {
            flex: 0 0 auto;
        }
    }
</style>
