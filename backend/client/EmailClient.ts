import nodemailer from 'nodemailer';
import SMTPTransport, { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

import secretConfig from '../../common/config/secret-config.json';

const options: SMTPTransport.Options = {
    host: secretConfig.email.host,
    auth: {
        user: secretConfig.email.username,
        pass: secretConfig.email.password,
    },
};

const transporter = nodemailer.createTransport(options);

export const EmailClient = {

    async sendEmail(
            to: string,
            from: string,
            subject: string,
            contentText: string,
            contentHTML: string): Promise<SentMessageInfo> {

        return await transporter.sendMail({
            to,
            from,
            subject,
            text: contentText,
            html: contentHTML,
        });
    },
}
