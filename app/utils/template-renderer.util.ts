import * as path from 'path';
import * as fs from 'fs';
import * as HandleBars from 'hbs';

export class TemplateRenderer {
  public static render(template: string, context: any): string {
    let renderedTemplate = '';
    const viewDir = path.join(__dirname, '..', '..', 'views', template);
    const templateContent = fs.readFileSync(viewDir, { encoding: 'utf-8' });
    const templateSpec = HandleBars.handlebars.compile(templateContent);
    renderedTemplate = templateSpec({
      ...context,
      LOGO: process.env.EMAIL_LOGO,
      APP_NAME: process.env.APP_NAME,
      EMAIL_ADDRESSEE: process.env.EMAIL_ADDRESSEE,
      YEAR: new Date().getFullYear(),
      WEBSITE: 'https://imointerns.app',
    });
    return renderedTemplate;
  }
}
