export const surveyResultPath = {
  put: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Enquete'],
    summary: 'API para criar a resposta de uma enquete',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/saveSurveyParams',
          },
        },
      },
    },
    parameters: [
      {
        in: 'path',
        name: 'surveyId',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/surveyResult' },
          },
        },
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
