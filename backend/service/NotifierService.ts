import fs from 'fs';
import path from 'path';

import { EmailClient } from '../client/EmailClient';

import secretConfig from '../../common/config/secret-config.json';

import { FirebaseClient } from '../client/FirebaseClient';
import { NotifierUserSettingsMapper } from '../mapper/NotifierUserSettingsMapper';
import { LogUtils } from '../util/LogUtils';
import { alphabetical } from '../../common/util/SortUtils';

import { Deal } from '../../common/model/Deal';
import { NotifierUserSettings } from '../../common/model/NotifierUserSettings';
import { NotifierResult, NotifierResultEmailStatus } from '../../common/model/NotifierResult';

const getEmailContent = (type: string, deal: Deal) => {
    const file = type === 'html'
            ? '../resources/email-new-deal.html'
            : '../resources/email-new-deal.txt';

    const categories = deal.categories
            .sort(alphabetical)
            .map(c => `<span>${c}</span>`)
            .join('');

    return fs.readFileSync(path.join(__dirname, file), 'utf8')
            .replace('{{deal_title}}', deal.title)
            .replace('{{deal_categories}}', categories);
};

const notify = async (
        emailAddress: string,
        deal: Deal,
        textContent: string,
        htmlContent: string): Promise<NotifierResultEmailStatus> => {

    try {
        await EmailClient.sendEmail(
                emailAddress,
                '"Meteor Deals" <email@wjbaker.com>',
                `${deal.title}`,
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

    async notifyUsers(deal: Deal): Promise<NotifierResult | Error> {
        LogUtils.log('NotifierService.notifyUsers');

        try {
            const data = await FirebaseClient.getCollection('notifier');

            const { testEmails } = secretConfig.email;

            const recipients = data.map(d => (
                NotifierUserSettingsMapper.fromFirestore(d.id, d.data())
            ))
            // .filter(r => testEmails.includes(r.emailAddress))
            .filter(r => r.isEnabled)
            .filter(r => r.whitelistedCategories.length === 0 || (
                deal.categories.some(dealCategory => (
                    r.whitelistedCategories.some(category => (
                        category.toLowerCase() === dealCategory.toLowerCase()
                    ))
                ))
            ))
            .filter(r => r.blacklistedCategories.length === 0 || !(
                deal.categories.some(dealCategory => (
                    r.blacklistedCategories.some(category => (
                        category.toLowerCase() === dealCategory.toLowerCase()
                    ))
                ))
            ));

            const textContent = getEmailContent('text', deal);
            const htmlContent = getEmailContent('html', deal);

            const requests = Promise.all(recipients.map(u => (
                notify(u.emailAddress, deal, textContent, htmlContent)
            )));

            const results = await requests;

            return {
                dealID: deal.id,
                results,
            }
        }
        catch (exception) {
            return new Error(exception);
        }
    },
}
