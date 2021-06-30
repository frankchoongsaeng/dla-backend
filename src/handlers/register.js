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


function register(req, res) {
  const body = req.body;

  // gaurd statement
  if (!validate_request_data(body))
    return res.status(400).json({ 'message': 'missing or invalid fields' });

  // check if email already exists
  db_actions.getOne({
    from: models.USER,
    query: { email: body.email }
  },
    (err, data_found) => {

      if (err) {
        return res.status(500).json({ message: 'unable to complete request, server error.' });
      }

      // verify that the email was found
      if (data_found && (data_found.email === body.email))
        return res.status(409).json({ message: 'email has already been registered' });

      // set the current user role to customer
      body.role = roles.CUSTOMER;

      // continue if email is not already registered
      hash_password(body);

      if (body.image)
        delete body.image

      db_actions.create({
        to: models.USER,
        data: body
      }, (_err, data) => {
        console.log({ _err })
        let response = {
          ...JSON.parse(JSON.stringify(data)),
          token: generate_token(data)
        }
        // data.token = generate_token(data);
        res.json(response)
      })
    })

}


module.exports = register;