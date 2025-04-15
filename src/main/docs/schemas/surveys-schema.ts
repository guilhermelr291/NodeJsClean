export const surveysSchema = {
  type: 'array',
  items: {
    $ref: '#/components/schemas/surveyAnswer',
  },
};
