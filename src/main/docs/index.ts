import { badRequest, notFound, serverError, unauthorized } from './components';
import { loginPath } from './paths';
import { accountSchema, errorSchema, loginParamsSchema } from './schemas';

export default {
  openapi: '3.0.4',
  info: {
    title: 'Clean Node API',
    description: 'Clean Node API to make surveys',
    version: '1.0.0',
  },
  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT',
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
    badRequest: badRequest,
    serverError: serverError,
    unauthorized: unauthorized,
    notFound: notFound,
    schemas: {
      account: accountSchema,
      loginParams: loginParamsSchema,
      error: errorSchema,
    },
  },
};
