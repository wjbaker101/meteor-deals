<template>
    <div id="app" class="flex">
        <HeaderComponent />
        <router-view class="router-view" />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    import HeaderComponent from '@/component/HeaderComponent.vue';

    @Component({
        components: {
            HeaderComponent,
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

    #app {
        grid-template-columns: var(--nav-width) 1fr;

        @media only screen and (max-width: 50rem) {
            flex-direction: column;
        }
    }

    .router-view {
        flex: 1;
        overflow-y: auto;
        padding: var(--spacing-small);

        @media only screen and (max-width: 50rem) {
            overflow-y: initial;
        }
    }
</style>
