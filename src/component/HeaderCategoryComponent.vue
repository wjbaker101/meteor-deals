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
        <span class="remove" @click="onRemoveCategory">
            &times;
        </span>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    import { Category } from '@common/model/Category';

    import CategoryComponent from '@/component/CategoryComponent.vue';

    @Component({
        components: {
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

        .remove {
            font-size: 1.5rem;
            font-weight: bold;
            line-height: 1em;
            cursor: pointer;
        }
    }
</style>
