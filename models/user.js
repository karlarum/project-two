module.exports = (mongoose) => {
  const userSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 5
    },
    contact_information: {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      phone_number: {
        type: String,
        match: /^[0-9]{10,15}$/
      },
      preferred_contact: {
        type: String,
        enum: ['email', 'phone']
      }
    },
    equipment: {
      equipment_type: {
        type: String
      },
      make: {
        type: String
      },
      model: {
        type: String
      },
      serial_number: {
        type: String
      }
    },
    observation_log: {
      observations: {
        type: [String],
        default: []
      }
    }
  });

  return mongoose.model('user', userSchema);
};
