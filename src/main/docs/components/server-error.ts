export const serverError = {
  description: 'Problema no servidor',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/error' },
    },
  },
};
