<template>
    <div class="footer-component">
        <small>
            <p>
                Copyright &copy; Meteor Deals 2020,
                <br>
                All rights reserved.
            </p>
            <p>Developed and maintained by <a href="https://wjbaker.com">William Baker</a>.</p>
            <p>Icons provided by <a href="https://fontawesome.com/license">FontAwesome</a>.</p>
        </small>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class FooterComponent extends Vue {
    }
</script>

<style lang="scss">
    .footer-component {
        flex: 0 0 auto;
        color: var(--black);
    }
</style>
