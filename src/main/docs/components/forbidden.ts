export const forbidden = {
  description: 'Acesso negado!',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/error' },
    },
  },
};
