<template>
    <div class="modal-component flex" :class="{ 'is-showing': isShowing }">
        <div class="content container">
            <slot />
            <div class="close" @click="onHideModal(id)">
                <CloseIcon />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

    import { EventService, Event } from '@/service/EventService';

    import CloseIcon from '@/assets/icon/times.svg';

    @Component({
        components: {
            CloseIcon,
        },
    })
    export default class ModalComponent extends Vue {

        @Prop({
            required: true,
        })
        private id!: string;

        private isShowing: boolean = false;

        created(): void {
            EventService.$on(Event.MODAL_SHOW, this.onShowModal);
            EventService.$on(Event.MODAL_HIDE, this.onHideModal);
        }

        destroyed(): void {
            EventService.$off(Event.MODAL_SHOW, this.onShowModal);
            EventService.$off(Event.MODAL_HIDE, this.onHideModal);
        }

        onShowModal(id: string): void {
            if (this.id !== id) {
                return;
            }

            this.isShowing = true;
        }

        onHideModal(id: string): void {
            if (this.id !== id) {
                return;
            }

            this.isShowing = false;
        }
    }
</script>

<style lang="scss">
    .modal-component {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.7);
        opacity: 0;
        pointer-events: none;
        transition: opacity var(--duration);

        &.is-showing {
            opacity: 1;
            pointer-events: all;
        }

        .content {
            display: table;
            margin: auto;
        }

        .close {
            position: absolute;
            top: 0;
            right: 0;
            padding: var(--spacing-small);
            cursor: pointer;
            transition: color var(--duration);

            &:hover {
                color: var(--secondary);
            }
        }
    }
</style>
