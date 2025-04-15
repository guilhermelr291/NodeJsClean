import { loginPath } from './paths/login-path';
import { accountSchema } from './schemas/account-schema';
import { loginParamsSchema } from './schemas/login-params-schema';

export default {
  openapi: '3.0.4',
  info: {
    title: 'Clean Node API',
    description: 'Clean Node API to make surveys',
    version: '1.0.0',
  },

  servers: [
    {
      url: '/api',
    },
  ],
  tags: [
    {
      name: 'Login',
    },
  ],
  paths: {
    '/login': loginPath,
  },
  components: {
    schemas: {
      account: accountSchema,
      loginParams: loginParamsSchema,
    },
  },
};
