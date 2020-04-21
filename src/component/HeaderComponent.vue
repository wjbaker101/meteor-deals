<template>
    <div class="header-component container-theme-4">
        <h1>
            <router-link to="/">Meteor Deals</router-link>
        </h1>
        <div class="container-theme-3">
            <h2>Search</h2>
            <input
                type="text"
                placeholder="Try a food or game"
                v-model="searchText">
        </div>
        <p></p>
        <div class="container-theme-3">
            <h2>Category</h2>
            <input
                type="text"
                placeholder="Try 'Freebie' or 'Shopmium'"
                @keyup.enter="onCategoryInputEnter"
                v-model="category">
            <div class="header-categories">
                <HeaderCategoryComponent
                    :key="`category-${category.name}`"
                    v-for="(category, index) in categories"
                    :category="category"
                    :index="index" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

    import { Category } from '@/model/Category';

    import { EventService, Event } from '@/service/EventService';

    import HeaderCategoryComponent from '@/component/HeaderCategoryComponent.vue';

    @Component({
        components: {
            HeaderCategoryComponent,
        },
    })
    export default class HeaderComponent extends Vue {

        private category: string = '';

        get categories(): Category[] {
            return this.$store.state.categories;
        }

        get searchText(): string {
            return this.$store.state.searchText;
        }

        set searchText(searchText: string) {
            this.$store.dispatch('setSearchText', searchText);
        }

        onCategoryInputEnter(e: KeyboardEvent): void {
            if (this.category.length < 3) {
                return;
            }

            this.$store.dispatch('addCategory', {
                name: this.category,
                isEnabled: true,
            });

            this.category = '';
        }
    }
</script>

<style lang="scss">
    .header-component {
        flex: 0 0 var(--nav-width);

        h1 a {
            text-decoration: none;
            color: inherit;
        }

        .header-categories {
            padding-top: 1rem;
        }

        .category {
            align-items: center;
            margin-bottom: 0.5rem;

            .category-remove {
                font-size: 1.5rem;
                font-weight: bold;
                line-height: 1em;
                cursor: pointer;
            }
        }
    }
</style>
