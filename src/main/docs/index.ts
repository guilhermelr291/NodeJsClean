import {
  badRequest,
  forbidden,
  notFound,
  serverError,
  unauthorized,
} from './components';
import { loginPath, surveyPath } from './paths';
import {
  accountSchema,
  apiKeyAuthSchema,
  errorSchema,
  loginParamsSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema,
} from './schemas';

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
    {
      name: 'Enquete',
    },
  ],
  paths: {
    '/login': loginPath,
    '/surveys': surveyPath,
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema,
    },
    badRequest: badRequest,
    serverError: serverError,
    unauthorized: unauthorized,
    notFound: notFound,
    forbidden: forbidden,
    schemas: {
      account: accountSchema,
      loginParams: loginParamsSchema,
      error: errorSchema,
      surveyAnswer: surveyAnswerSchema,
      survey: surveySchema,
      surveys: surveysSchema,
    },
  },
};
