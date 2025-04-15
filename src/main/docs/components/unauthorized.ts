export const unauthorized = {
  description: 'Credenciais inválidas',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/error' },
    },
  },
};
