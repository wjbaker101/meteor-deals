
import fs from 'fs';
import path from 'path';
import { EmailClient } from '../client/EmailClient';

import { FirebaseClient } from '../client/FirebaseClient';
import { NotifierUserSettingsMapper } from '../mapper/NotifierUserSettingsMapper';

import { Deal } from '../../common/model/Deal';
import { NotifierUserSettings } from '../../common/model/NotifierUserSettings';
import { NotifierResult, NotifierResultEmailStatus } from '../../common/model/NotifierResult';

const getEmailContent = (type: string, deal: Deal) => {
    const file = type === 'html'
            ? '../resources/email-new-deal.html'
            : '../resources/email-new-deal.txt';

    return fs.readFileSync(path.join(__dirname, file), 'utf8')
            .replace('{{deal_title}}', deal.title);
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

        try {
            await FirebaseClient.setDoc('notifier', userID, settings)
        }
        catch (exception) {
            return new Error(exception);
        }
    },

    async removeUserFromNotifier(userID: string): Promise<void | Error> {
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
        try {
            const data = await FirebaseClient.getCollection('notifier');

            const recipients = data.map(d => (
                NotifierUserSettingsMapper.fromFirestore(d.id, d.data())
            ))
            .filter(r => r.isEnabled)
            .filter(r => (
                deal.categories
                    .map(c => c.toLowerCase())
                    .some(c => (
                        r.whitelistedCategories
                            .map(w => w.toLowerCase())
                            .some(w => c === w)
                    ))
            ))
            .filter(r => !(
                deal.categories
                    .map(c => c.toLowerCase())
                    .some(c => (
                        r.whitelistedCategories
                            .map(w => w.toLowerCase())
                            .some(w => c === w)
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
