const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    phone_number: {
      type: 'string',
      pattern: '^[0-9]{10}$',
    },
  },
  errorMessage: {
    properties: {
      name: 'name should be a valid string with at least 1 character, current value is ${/name}',
      phone_number: 'phone_number should be a valid string with 10 characters, current value is ${/phone_number}',
    },
  },
  required: ['phone_number'],
}

export default schema
