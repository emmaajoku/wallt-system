import * as Joi from '@hapi/joi';

export const EnvValidationSchema = Joi.object({
  MONGO_DB_URL: Joi.string().required(),

});
