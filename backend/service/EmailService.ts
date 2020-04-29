import { EmailClient } from '../client/EmailClient';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { User } from '../../common/model/User';

export const EmailService = {

    async notifyUser(user: User): Promise<SentMessageInfo | Error> {
        try {
            return await EmailClient.sendEmail(
                    user.emailAddress,
                    '"Meteor Deals" <email@wjbaker.com>',
                    'New Deal Available!',
                    'New Deal Text!',
                    'New Deal HTML!');
        }
        catch (exception) {
            return new Error(exception);
        }
    },
}
