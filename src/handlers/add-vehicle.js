const db_actions = require("../db")
const models = require("../constants/models");
const roles = require("../constants/roles");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// generate token for user
function generate_token(data) {
  let _data = {
    email: 'data.email',
    // _id: data.id
  }
  return jwt.sign(_data, 'SECRET');
}

// hash password inside the request body
function hash_password(data) {
  data.password = bcrypt.hashSync(data.password, 5);
}

// validate the data from request body
function validate_request_data(data) {
  // should contain first_name & first_name should not be empty
  if ((typeof data.first_name !== 'string') || !data.first_name.trim().length) {
    return false;
  }

  // should contain last_name & last_name should not be empty
  if ((typeof data.last_name !== 'string') || !data.last_name.trim().length) {
    return false;
  }

  // should contain email & email should not be empty
  if ((typeof data.email !== 'string') || !data.email.trim().length) {
    return false;
  }

  // should contain password & password should not be empty
  if ((typeof data.password !== 'string') || !data.password.trim().length) {
    return false;
  }

  // should contain mobile_number & mobile_number should not be empty
  if ((typeof data.mobile_number !== 'string') || !data.mobile_number.trim().length) {
    return false;
  }

  // should contain city & city should not be empty
  if ((typeof data.city !== 'string') || !data.city.trim().length) {
    return false;
  }

  // should contain region & region should not be empty
  if ((typeof data.region !== 'string') || !data.region.trim().length) {
    return false;
  }

  return true;
}


function add_vehicle(req, res) {
  const body = req.body;

  // TODO validate vehicle registration data
  // gaurd statement 
  // if (!validate_request_data(body))
  //   return res.status(400).json({ 'message': 'missing or invalid fields' });

  // check if vehicle is already registered
  db_actions.getOne({
    from: models.VEHICLE,
    query: { vin: body.vin }
  },
    (err, data_found) => {
      // TODO implement proper error handling
      if (err) console.log(err);

      // verify that the vehicle was found
      if (data_found && (data_found.vehicle_number === body.vehicle_number))
        return res.status(409).json({ message: 'this vehicle has already been added' });

      // set the status, registration date, and created date for new entry
      body.status = 'processing';
      body.reg_date = Date.now();
      body.createdAt = Date.now(); 

      db_actions.create({
        to: models.VEHICLE,
        data: body
      }, (_err) => {
        console.log({ _err })
        let response = {
          message: 'vehicle added successfully'
        }
        // data.token = generate_token(data);
        res.json(response)
      })
    })

}


module.exports = add_vehicle;