const schema = {
  type: 'object',
  properties: {
    phone_number: {
      type: 'string',
      pattern: '^[0-9]{10}$',
    },
    otp: {
      type: 'string',
      pattern: '^[0-9]{4}$',
    },
  },
  errorMessage: {
    properties: {
      phone_number: 'phone_number should be a valid string with 10 characters, current value is ${/phone_number}',
      otp: 'otp should be a valid string with 4 character, current value is ${/otp}',
    },
  },
  required: ['phone_number', 'otp'],
}

export default schema
