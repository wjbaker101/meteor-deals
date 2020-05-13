<template>
    <span class="click-to-copy-component" @click="onClick" :class="{ 'is-success': isSuccess, 'is-supported': isSupported }">
        {{ content }}<CopyIcon v-if="isSupported" />
    </span>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Ref } from 'vue-property-decorator';

    import CopyIcon from '@/assets/icon/copy.svg';

    @Component({
        components: {
            CopyIcon,
        },
    })
    export default class CLickToCopyComponent extends Vue {

        @Prop({
            required: true,
        })
        private readonly content!: string;

        private isSuccess: boolean = false;

        get isSupported(): boolean {
            return document.queryCommandSupported
                    && document.queryCommandSupported('copy')
        }

        onClick(): void {
            if (!this.isSupported) {
                return;
            }

            const input = document.createElement('input');
            input.setAttribute('value', this.content);
            document.body.appendChild(input);
            input.select();

            try {
                document.execCommand('copy');

                this.isSuccess = true;

                setTimeout(() => {
                    this.isSuccess = false;
                }, 1000);
            }
            catch (exception) {
                console.log(`Couldn't copy to clipboard.`);
            }
            finally {
                document.body.removeChild(input);
            }
        }
    }
</script>

<style lang="scss">
    .click-to-copy-component {
        font-weight: bold;

        &.is-supported {
            padding: var(--spacing-xsmall);
            border-radius: var(--border-radius);
            border: 1px solid var(--black-dark);
            cursor: copy;

            textarea {
                display: none;
            }

            .icon-copy {
                margin-left: var(--spacing-xsmall);
            }

            * {
                vertical-align: baseline;
            }

            &.is-success {
                animation: flash-success 1s;
            }

            @keyframes flash-success {
                0% {
                    background-color: rgba(80, 200, 80, 0.4);
                }

                50% {
                    background-color: rgba(80, 200, 80, 0.4);
                }

                100% {
                    background-color: transparent;
                }
            }
        }
    }
</style>
