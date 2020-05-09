<template>
    <div class="header-category-component flex">
        <div>
            <input type="checkbox" v-model="isEnabled">
        </div>
        <div>
            <CategoryComponent :category="category" />
        </div>
        <div>
            ({{ frequency }})
        </div>
        <CrossIcon class="remove" @click="onRemoveCategory" />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    import { Category } from '@common/model/Category';

    import CrossIcon from '@/assets/icon/times.svg';
    import CategoryComponent from '@/component/CategoryComponent.vue';

    @Component({
        components: {
            CrossIcon,
            CategoryComponent,
        },
    })
    export default class HeaderCategoryComponent extends Vue {

        @Prop()
        private readonly index!: number;

        @Prop()
        private readonly category!: Category;

        @Prop()
        private readonly frequency!: number;

        get isEnabled(): boolean {
            return this.category.isEnabled;
        }

        set isEnabled(isEnabled: boolean) {
            this.category.isEnabled = isEnabled;
        }

        onRemoveCategory(): void {
            this.$store.dispatch('removeCategoryAtIndex', this.index);
        }
    }
</script>

<style lang="scss">
    .header-category-component {
        align-items: center;
        margin-bottom: var(--spacing-xsmall);
        line-height: 1em;


        .remove {
            $size: 0.8rem;

            width: $size;
            height: $size;
            cursor: pointer;

            &:hover {
                color: var(--secondary);
            }
        }
    }
</style>
