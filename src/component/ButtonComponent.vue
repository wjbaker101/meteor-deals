<template>
    <button class="button-component" @click="onClick">
        <div class="loading-icon" v-if="isLoading">
            <LoadingIcon />
        </div>
        <div v-else>
            <slot />
        </div>
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

        onClick(e: MouseEvent): void {
            this.$emit('click', e);
        }
    }
</script>

<style lang="scss">
    .button-component {
        width: 100%;
        padding: 0.5rem 1rem;
        font: inherit;
        font-weight: bold;
        letter-spacing: inherit;
        background-color: var(--theme-3);
        color: var(--white);
        border: 0;
        border-radius: var(--border-radius);
        box-shadow: 0 0 8px rgba(34, 34, 34, 0.5) inset;
        cursor: pointer;
        transition: background-color var(--duration);

        &:hover {
            background-color: var(--theme-4);
            box-shadow: 0 0 8px rgba(34, 34, 34, 0.9) inset;
        }

        .loading-icon {
            height: 1em;
            display: inline-block;
            padding: 0 0.5rem;
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: var(--border-radius);

            svg {
                position: relative;
                top: -12px;
            }
        }
    }
</style>
