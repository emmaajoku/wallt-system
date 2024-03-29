/**
 * `EmailOption` is an object with a `recipients` property that can be a single emailAddress address or an
 * array of emailAddress addresses, and it can optionally have a `from`, `subject`, `templateId`, and
 * `substitutions` property.
 * @property {any | any[]} recipients - The emailAddress address(es) of the recipient(s).
 * @property {string} from - The emailAddress address of the sender.
 * @property {string} subject - The subject of the emailAddress.
 * @property {string} templateId - The ID of the template you want to use.
 * @property {any} substitutions - This is a key-value pair of the variables you want to replace in
 * your template.
 */
export type EmailOption = {
  recipients: any | any[];
  from?: string;
  subject?: string;
  templateId?: string;
  substitutions?: any;
};
