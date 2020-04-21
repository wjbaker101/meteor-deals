<template>
    <div class="loading-component">
        <span class="icon">
            <LoadingIcon />
        </span>
        <span class="message">{{ message }}</span>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

    import LoadingIcon from '@/assets/icon/loading.svg';

    @Component({
        components: {
            LoadingIcon,
        },
    })
    export default class LoadingComponent extends Vue {

        @Prop()
        private readonly message!: string;
    }
</script>

<style lang="scss">
    .loading-component {

        .icon {
            display: inline-block;
            padding: 0.5rem;
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: var(--border-radius);
        }

        .message {
            margin-left: 1rem;
            font-weight: bold;
        }
    }
</style>
