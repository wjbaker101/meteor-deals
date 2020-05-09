<template>
    <button
        class="button-component"
        @click="onClick"
        :class="{ 'is-secondary': isSecondary }"
    >
        <div class="loading-icon" v-if="isLoading">
            <LoadingIcon />
        </div>
        <slot v-else />
    </button>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    import LoadingIcon from '@/assets/icon/loading.svg';

    @Component({
        components: {
            LoadingIcon,
        },
    })
    export default class ButtonComponent extends Vue {

        @Prop({
            default: false,
        })
        private isLoading!: boolean;

        @Prop({
            default: false,
        })
        private isSecondary!: boolean;

        onClick(e: MouseEvent): void {
            this.$emit('click', e);
        }
    }
</script>

<style lang="scss">
    .button-component {
        width: 100%;
        padding: var(--spacing-xsmall) var(--spacing-small);
        font: inherit;
        font-weight: bold;
        letter-spacing: inherit;
        background-color: var(--primary);
        color: var(--white);
        border: 1px solid var(--secondary);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: background-color var(--duration);

        &:hover {
            background-color: var(--primary-dark);
        }

        &.is-secondary {
            background-color: var(--black);
            border-color: var(--tertiary);

            &:hover {
                background-color: var(--black-dark);
            }
        }

        .loading-icon {
            height: 1em;
            display: inline-block;
            padding: 0 var(--spacing-xsmall);
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: var(--border-radius);

            svg {
                position: relative;
                top: -12px;
            }
        }

        & > .svg-icon {
            margin-right: var(--spacing-xsmall);
        }
    }
</style>
