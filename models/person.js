const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 3,
      required: true
    },
    number: {
      type: String,
      validate: {
        validator: function (value) {
          // Define a regular expression to match the valid phone number format
          const phoneNumberRegex = /^(?:\d{2,3}-\d+)$/;
          if (!phoneNumberRegex.test(value)) {
            return false; // Invalid format, return false
          }
  
          // Split the phone number by hyphen to check the second part
          const parts = value.split('-');
          if (parts.length !== 2) {
            return false; // Invalid format, return false
          }
  
          // Check if the second part (after the hyphen) has at least 8 digits
          const secondPart = parts[1];
          const digitCount = secondPart.replace(/\D/g, '').length; // Count digits
          return digitCount >= 8;
        },
        message: 'Invalid phone number format or not enough digits in the second part.'
      },
      required: true
    }
  });
  
  module.exports = mongoose.model('Person', personSchema);
  

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)