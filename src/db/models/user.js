const mongoose = require('mongoose');

const User = new mongoose.Schema({
  image: String,
  title: String,
  first_name: String,
  middle_name: String,
  last_name: String,
  gender: String,
  dob: Date,
  nationality: String,
  city: String,
  region: String,
  country: String,
  address_full: String,
  mobile_number: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  role: String,
  department: String,
  user_role: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  toJSON: {
    transform: (_doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
    }
  }
});

module.exports = mongoose.model('users', User);