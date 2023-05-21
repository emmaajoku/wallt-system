import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import { EmailOption } from './types/mail.types';
import { InternalErrorException } from '../exceptions';
import { config } from 'app/config/config';

@Injectable()
export class MailService {
  sendgridConfig() {
    SendGrid.setApiKey(config.sendGrid.apikey);
    SendGrid.setSubstitutionWrappers('{{', '}}'); // Configure the substitution tag wrappers globally
    return SendGrid;
  }
  async send(options: EmailOption): Promise<any> {
    const sendGridSend = this.sendgridConfig();
    try {
      const message: any = {
        to: options.recipients,
        from: options.from || 'support@dabawallet.com',
        subject: options.subject || 'Account Notification',
        templateId: options.templateId,
      };
      if (options.substitutions) {
        message.dynamic_template_data = Object.assign(
          {},
          options.substitutions,
        );
        return await sendGridSend.send(message);
      }
    } catch (error) {
      throw new InternalErrorException(error.message);
    }
  }
}
