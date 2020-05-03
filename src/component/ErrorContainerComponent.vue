<template>
    <div class="error-container-component container-error">
        <ErrorIcon />
        <span>{{ message }}</span>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    import ErrorIcon from '@/assets/icon/exclamation-triangle.svg';

    @Component({
        components: {
            ErrorIcon,
        },
    })
    export default class ErrorContainerComponent extends Vue {

        @Prop()
        private message!: string;
    }
</script>

<style lang="scss">
    .error-container-component {

        .svg-icon {
            margin-right: 0.5rem;
        }
    }
</style>
