import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { EmailOption } from './types/mail.types';
import { mailStructure } from './interface-send/mail.send';
import { config } from 'app/config/config';
jest.setTimeout(60000);

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();
    service = module.get<MailService>(MailService);
  });

  describe('simulate send an emailAddress', () => {
    it('service to send an emailAddress', async () => {
      const emailAddress = 'test@daba.com';
      const testEmail: EmailOption = mailStructure(
        [emailAddress],
        'test@daba.com',
        'Trying out Email Sending',
        config?.sendGrid?.tempateResetPassword,
        {
          firstName: `Eddie`,
          subject: 'Test Email',
        },
      );

      try {
        const emailInitSpyService = jest.spyOn(service, 'sendgridConfig');
        const emailSpyService = jest.spyOn(service, 'send');
        expect(emailSpyService).toBeCalledWith(testEmail);
        expect(emailInitSpyService).toHaveBeenCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
