import { Injectable } from '@nestjs/common';
import { _InternalMailerService as MailerService } from './mailer.internal.service';
import { compile } from 'handlebars';
import { ConfigService } from '@nestjs/config';

const EMAIL_CONFIRMATION_TEMPLATE = `<h2>Welcome to PaasTech!</h2>
<p>Please click the link below to confirm your email:</p>
<p>
    <a href="{{ url }}">Confirm</a>
</p>

<p>If you have trouble opening the link, you can copy the following URL into your browser: </p>
<p>{{ url }}</p>

<p>If you did not request this email you can safely ignore it.</p>`;

const PASSWORD_RESET_TEMPLATE = `<h2>Password reset</h2>
<p>Please click the link below to reset your password:</p>
<p>
    <a href="{{ url }}">Reset password</a>
</p>

<p>If you have trouble opening the link, you can copy the following URL into your browser: </p>
<p>{{ url }}</p>

<p>If you did not request this email please contact us immediatly.</p>`;

@Injectable()
export class MailService {

    private hostname: string;

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {
        this.hostname = `${this.configService.getOrThrow('APP_HOST')}:${this.configService.getOrThrow('APP_PORT')}`;
    }

    async sendUserConfirmation(email: string, token: string): Promise<boolean> {
        const url = `${this.hostname}/auth/confirm?token=${token}`;
        const template = compile(EMAIL_CONFIRMATION_TEMPLATE);

        return this.mailerService.sendMail({
            from: `${this.configService.getOrThrow('MAILER_FROM')}`,
            to: email,
            subject: 'Welcome to PaasTech!',
            html: template({ url }),

            // TODO: use @nestjs-modules/mailer once bumped to 10.0.0

            //template: './confirmation',
            //context: {
            //    url,
            //},
        }).then(() => {
            return true;
        }).catch((err: any) => {
            return false;
        });
    }

    async sendPasswordReset(email: string, token: string) {
        const url = `${this.hostname}/auth/pwreset?token=${token}`;
        const template = compile(PASSWORD_RESET_TEMPLATE);

        await this.mailerService.sendMail({
            to: email,
            subject: 'Password reset PaasTech !',
            html: template({ url }),

            // TODO: use @nestjs-modules/mailer once bumped to 10.0.0

            //template: './password-reset',
            //context: {
            //    url,
            //},
        });
    }

}