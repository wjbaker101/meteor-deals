import secretConfig from '../../common/config/secret-config.json';

import { EmailClient } from '../client/EmailClient';
import { FirebaseClient } from '../client/FirebaseClient';
import { NotifierUserSettingsMapper } from '../mapper/NotifierUserSettingsMapper';
import { LogUtils } from '../util/LogUtils';
import { ResourceUtils } from '../util/ResourceUtils';
import { alphabetical } from '../../common/util/SortUtils';

import { Deal } from '../../common/model/Deal';
import { NotifierUserSettings } from '../../common/model/NotifierUserSettings';
import { NotifierResult, NotifierResultEmailStatus } from '../../common/model/NotifierResult';

const notifications: {
    pool: Deal[],
    timeout: NodeJS.Timeout,
    delay: number,
} = {
    // A list of deals that have accumulated
    // These are pending to be notified to subscribers
    pool: [],

    // Timeout that waits a set amount of time before sending the notification
    timeout: null,

    delay: 1000 * 60 * 10,
};

const dealContainsCategory = (deal: Deal, categories: string[]) => {
    return deal.categories.some(dealCategory => (
        categories.some(category => (
            category.toLowerCase() === dealCategory.toLowerCase()
        ))
    ))
};

const getEmailAsText = (deals: Deal[]) => {
    const emailTitle = deals.length > 1
            ? 'New Deals Have Landed!'
            : 'A New Deal Has Landed!';

    return `
        ${emailTitle}\r\n
        \r\n
        Go to https://deals.wjbaker.com to view all the latest deals.\r\n
        \r\n
        To unsubscribe from email notifications, log into your account at https://deals.wjbaker.com/login and turn off notifications.
    `;
};

const getEmailAsHTML = (emailHTML: string, titleHTML: string, deals: Deal[]) => {
    const dealsHTML = deals.map(deal => {
        const categories = deal.categories
                .sort(alphabetical)
                .map(c => `<span>${c}</span>`)
                .join('');

        return titleHTML
                .replace('{{deal_title}}', deal.title)
                .replace('{{deal_categories}}', categories);
    })
    .join('');

    const emailTitle = deals.length > 1
            ? 'New Deals Have Landed!'
            : 'A New Deal Has Landed!';

    const buttonText = deals.length > 1
            ? 'Uncover these Deals'
            : 'Uncover this Deal';

    return emailHTML
            .replace('{{email_title}}', emailTitle)
            .replace('{{button_text}}', buttonText)
            .replace('{{deal_list}}', dealsHTML);
};

const notify = async (
        emailAddress: string,
        deals: Deal[],
        textContent: string,
        htmlContent: string): Promise<NotifierResultEmailStatus> => {

    try {
        const dealsTitle = deals.map(d => d.title).join(' | ');

        await EmailClient.sendEmail(
                emailAddress,
                '"Meteor Deals" <notifier@deals.wjbaker.com>',
                `${dealsTitle}`,
                textContent,
                htmlContent);

        return {
            emailAddress,
            isSuccess: true,
        }
    }
    catch (exception) {
        return {
            emailAddress,
            isSuccess: false,
            failureReason: exception,
        }
    }
};

export const NotifierService = {

    async getUserNotifierSettings(
            userID: string): Promise<NotifierUserSettings | null | Error> {

        LogUtils.log('NotifierService.getUserNotifierSettings');

        try {
            const data = await FirebaseClient.getDoc('notifier', userID);

            return data || null;
        }
        catch (exception) {
            return new Error(exception);
        }
    },

    async setUserInNotifier(
            userID: string,
            settings: NotifierUserSettings): Promise<void | Error> {

        LogUtils.log('NotifierService.setUserInNotifier');

        try {
            await FirebaseClient.setDoc('notifier', userID, settings)
        }
        catch (exception) {
            return new Error(exception);
        }
    },

    async removeUserFromNotifier(userID: string): Promise<void | Error> {
        LogUtils.log('NotifierService.removeUserFromNotifier');

        try {
            await FirebaseClient.updateDoc('notifier', userID, {
                isEnabled: false,
            });
        }
        catch (exception) {
            return new Error(exception);
        }
    },

    async notifyUsers(deal: Deal): Promise<void> {
        LogUtils.log('NotifierService.notifyUsers');

        notifications.pool.push(deal);

        clearTimeout(notifications.timeout);

        // Refresh the current timeout
        notifications.timeout = setTimeout(async () => {
            await this.sendNotifications();

            clearTimeout(notifications.timeout);

            notifications.timeout = null;
            notifications.pool = [];
        }, notifications.delay);
    },

    async sendNotifications(): Promise<NotifierResult | Error> {
        LogUtils.log('NotifierService.sendNotifications');
        LogUtils.log(`Notifier pool size: ${notifications.pool.length}`);

        try {
            const data = await FirebaseClient.getCollection('notifier');

            const { testEmails } = secretConfig.email;

            const recipients = data.map(d => (
                NotifierUserSettingsMapper.fromFirestore(d.id, d.data())
            ))
            .filter(r => testEmails.includes(r.emailAddress))
            .filter(r => r.isEnabled);

            const emailHTMLContent
                    = ResourceUtils.getResource('email-new-deal.html');

            const dealTitleHTMLContent
                    = ResourceUtils.getResource('email-new-deal-title.html');

            const notifier = recipients.map(recipient => {
                const deals = notifications.pool
                        .filter(deal => (
                            recipient.whitelistedCategories.length === 0 ||
                            dealContainsCategory(deal, recipient.whitelistedCategories)
                        ))
                        .filter(deal => (
                            recipient.blacklistedCategories.length === 0 ||
                            !dealContainsCategory(deal, recipient.blacklistedCategories)
                        ));

                const textContent = getEmailAsText(deals);

                const htmlContent = getEmailAsHTML(
                        emailHTMLContent,
                        dealTitleHTMLContent,
                        deals);

                return notify(
                        recipient.emailAddress,
                        deals,
                        textContent,
                        htmlContent);
            });

            const results = await Promise.all(notifier);

            return {
                dealIDs: notifications.pool.map(d => d.id),
                results,
            }
        }
        catch (exception) {
            return new Error(exception);
        }
    },
}
