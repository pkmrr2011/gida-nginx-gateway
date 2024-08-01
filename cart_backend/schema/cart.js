const schema = {
  type: 'object',
  properties: {
    userId: {
      type: 'number',
      minimum: 1,
    },
    productId: {
      type: 'number',
      minimum: 1,
    },
    quantity: {
      type: 'number',
      minimum: 0,
    },
  },
  errorMessage: {
    type: 'object',
    properties: {
      userId: 'UserId should be a number greater than 0, but got "${/userId}".',
      productId: 'ProductId should be a number greater than 0, but got "${/productId}".',
      quantity: 'Quantity should be a positive number, but got "${/quantity}".',
    },
  },
  required: ['userId', 'productId', 'quantity'],
}

export default schema
