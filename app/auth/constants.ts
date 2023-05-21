import { config } from 'app/config/config';

export const jwtConstants = {
  secret: config.auth.secret,
};
