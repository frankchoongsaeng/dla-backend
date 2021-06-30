const mongoose = require('mongoose');

const Vehicle = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  vin: String,
  model_number: String,
  vehicle_type: String,
  chasis_number: String,
  model: String,
  color: String,
  vehicle_year: String,
  mileage: String,
  alarm_type: String,
  manufacturing_company: String,
  reg_date: Date,
  images: String,
  description: String,
  status: String,
  createdAt: Date,
  updatedAt: { type: Date, default: Date.now },
}, {
  toJSON: {
    transform: (_doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('vehicles', Vehicle);