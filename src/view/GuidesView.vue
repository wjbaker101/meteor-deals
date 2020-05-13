<template>
    <div class="guides-view">
        <div class="view-content">
            <h1>Guides</h1>
            <p>This page is all about information on how you can get the deals for yourself.</p>
            <h3>Skip To:</h3>
            <ul>
                <li><a href="#shopmium">Shopmium</a></li>
                <li><a href="#checkoutsmart+clicksnap">CheckoutSmart (a.k.a ClickSnap)</a></li>
                <li><a href="#greenjinn">GreenJinn</a></li>
                <li><a href="#shoppix">Shoppix</a></li>
            </ul>
            <hr id="shopmium" class="guide-section">
            <h2>
                <img width="32" height="32" src="/img/external/shopmium_logo.png">
                <span> Shopmium</span>
            </h2>
            <p>Shopmium is a mobile app that allows you to upload a photo of a reciept in order to receive discounts on (usually food) products.</p>
            <p>There is no minimum cashback amount required, so the best thing to do is to immediately transfer all cashback to your bank account.</p>
            <p>
                Look out for the <CategoryComponent :category="fakeCategory('Shopmium')" /> category on this website!
            </p>
            <blockquote>
                <header>
                    <ExclamationIcon />
                    <span>Interested in Shopmium?</span>
                </header>
                <p>
                    <span>Use the referral code: </span>
                    <ClickToCopyComponent :content="'9d6di'" />
                    <span>, when signing up to get an extra £3 cashback.</span>
                </p>
            </blockquote>
            <h3>Helpful Links</h3>
            <p>
                Find their list of offers <a :href="url.shopmium.offers">here</a>.
            </p>
            <p>
                Download their app on <a :href="url.shopmium.android">Android</a> or <a :href="url.shopmium.iOS">iOS</a>.
            </p>
            <hr id="checkoutsmart+clicksnap" class="guide-section">
            <h2>
                <img width="32" height="32" src="/img/external/checkoutsmart_logo.png">
                <span> CheckoutSmart (a.k.a </span>
                <img width="32" height="32" src="/img/external/clicksnap_logo.png">
                <span> ClickSnap)</span>
            </h2>
            <p>Both CheckoutSmart and ClickSnap are mobile apps that allow you to upload a photo of a reciept in order to receive discounts on (usually food) products.</p>
            <blockquote>
                <header>
                    <ExclamationIcon />
                    <span>Important Note</span>
                </header>
                <p>They are owned by the same company, so you <strong>cannot</strong> double up on cashback! They will also deny receipts if you've already used it for the other app.</p>
            </blockquote>
            <p>There is a minimum cashback amount of £20. Make sure to transfer all your acculumated cashback as soon as possible.</p>
            <p>
                Look out for the <CategoryComponent :category="fakeCategory('CheckoutSmart')" /> and <CategoryComponent :category="fakeCategory('ClickSnap')" /> categories on this website!
            </p>
            <h3>Helpful Links</h3>
            <p>
                Find their list of offers at <a :href="url.checkoutsmart.offers">CheckoutSmart</a> or <a :href="url.clicksnap.offers">ClickSnap</a>.
            </p>
            <p>Download CheckoutSmart on <a :href="url.checkoutsmart.android">Android</a> or <a :href="url.checkoutsmart.iOS">iOS</a>.</p>
            <p>Download ClickSnap on <a :href="url.clicksnap.android">Android</a> or <a :href="url.clicksnap.iOS">iOS</a>.</p>
            <hr id="greenjinn" class="guide-section">
            <h2>
                <img width="32" height="32" src="/img/external/greenjinn_logo.png">
                <span> GreenJinn</span>
            </h2>
            <p>GreenJinn is a mobile app that allows you to upload a photo of a reciept in order to receive discounts on (usually food) products.</p>
            <p>There is a minimum cashback amount of £2.50. Make sure to transfer all your acculumated cashback as soon as possible.</p>
            <p>You usually don't get free products, but many of them will be common grocery items which you may be buying anyway. Occasionally, there'll be a product which appears on another cashback app as well. That way you can get the product for free, or even make a little profit!</p>
            <p>
                Look out for the <CategoryComponent :category="fakeCategory('GreenJinn')" /> category on this website!
            </p>
            <h3>Helpful Links</h3>
            <p>Download GreenJinn on <a :href="url.greenjinn.android">Android</a> or <a :href="url.greenjinn.iOS">iOS</a>.</p>
            <hr id="shoppix" class="guide-section">
            <h2>
                <img width="32" height="32" src="/img/external/shoppix_logo.png">
                <span> Shoppix</span>
            </h2>
            <p>Shoppix will give you points when you upload photos of your receipts.</p>
            <p>You'll receive 25 points per receipt, which is boosted to 30 if you upload on the same day as the receipt's purchase date. The lowest tier of reward is 3200 points, where you'll receive £5 in a currency of your choice (e.g. Amazon, PayPal, Love2Shop...). It is best to cash out your points as soon as you reach the 1st tier.</p>
            <p>Additionally, they commonly show surveys. These are quick forms you fill out for extra points. These will also give "scratch cards" for a chance for even more points.</p>
            <h3>Helpful Links</h3>
            <p>Download Shoppix on <a :href="url.shoppix.android">Android</a> or <a :href="url.shoppix.iOS">iOS</a>.</p>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    import { Category } from '@common/model/Category';

    import ExclamationIcon from '@/assets/icon/exclamation-circle.svg';
    import CategoryComponent from '@/component/CategoryComponent.vue';
    import ClickToCopyComponent from '@/component/ClickToCopyComponent.vue';

    @Component({
        components: {
            ExclamationIcon,
            CategoryComponent,
            ClickToCopyComponent,
        },
    })
    export default class GuidesView extends Vue {

        private readonly shopmiumCategory: Category = {
            name: 'Shopmium',
            isEnabled: false,
        };

        private readonly url: Object = {
            shopmium: {
                offers: 'https://offers.shopmium.com/uk/',
                android: 'https://play.google.com/store/apps/details?id=com.shopmium',
                iOS: 'https://apps.apple.com/gb/app/shopmium-save-money-every-day/id453007855',
            },
            checkoutsmart: {
                offers: 'https://www.checkoutsmart.com/deals',
                android: 'https://play.google.com/store/apps/details?id=com.checkoutsmart.checkoutsmart',
                iOS: 'https://apps.apple.com/gb/app/checkoutsmart-grocery-cashback/id781550042',
            },
            clicksnap: {
                offers: 'https://www.quidco.com/clicksnap/offers/',
                android: 'https://play.google.com/store/apps/details?id=com.quidco.clicksnap',
                iOS: 'https://apps.apple.com/gb/app/clicksnap/id644301306',
            },
            greenjinn: {
                android: 'https://play.google.com/store/apps/details?id=com.greenjinn.greenjinncoupons',
                iOS: 'https://apps.apple.com/gb/app/greenjinn-cashback-app-uk/id1113992461',
            },
            shoppix: {
                android: 'https://play.google.com/store/apps/details?id=com.kantarworldpanel.shoppix',
                iOS: 'https://apps.apple.com/gb/app/shoppix/id1184563264',
            },
        };

        fakeCategory(name: string): Category {
            return {
                name,
                isEnabled: false,
            }
        }
    }
</script>

<style lang="scss">
    .guides-view {

        .view-content {
            max-width: 720px;
            margin: 0 auto;
        }

        .guide-section {
            & + h2 {
                margin: calc(var(--spacing-small) * -1);
                margin-bottom: calc(var(--spacing-xsmall) * -1);
                padding: var(--spacing-small);
                border: 1px solid transparent;
                border-radius: var(--border-radius);
            }

            &:target + h2 {
                animation: target-animation 1s;

                @keyframes target-animation {
                    0% {
                        border-color: var(--secondary);
                        background-color: var(--black-dark);
                    }

                    40% {
                        border-color: var(--secondary);
                        background-color: var(--black-dark);
                    }

                    100% {
                        border-color: transparent;
                        background-color: transparent;
                    }
                }
            }
        }
    }
</style>
