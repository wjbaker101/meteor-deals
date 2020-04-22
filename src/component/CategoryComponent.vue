<template>
    <span class="category-component">
        {{ category.name }}
    </span>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    import { Category } from '@common/model/Category';

    @Component
    export default class CategoryComponent extends Vue {

        @Prop()
        private readonly category!: Category;
    }
</script>

<style lang="scss">
    .category-component {
        display: inline-block;
        line-height: 1em;
        padding: 0.25rem 0.5rem;
        margin: 0 0.25rem;
        font-size: 0.7em;
        background-color: var(--theme-1);
        color: var(--black);
        border-radius: var(--border-radius);
        box-shadow: 0 0 8px rgba(34, 34, 34, 0.3) inset;
    }
</style>
