export const signUpPath = {
  post: {
    tags: ['Login'],
    summary: 'API para criar conta de um usuário',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/signUpParams',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/account' },
          },
        },
      },
      400: {
        $ref: '#components/badRequest',
      },
      403: {
        $ref: '#components/forbidden',
      },
      404: {
        $ref: '#components/notFound',
      },
      500: {
        $ref: '#components/serverError',
      },
    },
  },
};
