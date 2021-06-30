const db_actions = require("../db")
const models = require("../constants/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const roles = require("../constants/roles");

// hash password inside the request body
function compare_passwords(provided_password, password_hash) {
  return bcrypt.compareSync(provided_password, password_hash);
}

// validate the data from request body
function validate_request_data(data) {
  // should contain email & email should not be empty
  if ((typeof data.email !== 'string') || !data.email.trim().length) {
    return false;
  }

  // should contain password & password should not be empty
  if ((typeof data.password !== 'string') || !data.password.trim().length) {
    return false;
  }

  return true;
}

// generate token for user
function generate_token(data) {
  let _data = {
    email: data.email,
    _id: data.id
  }
  return jwt.sign(_data, 'SECRET');
}

function login_admin(req, res) {
  const body = req.body;

  // gaurd statement
  if (!validate_request_data(body))
    return res.status(400).json({ 'message': 'missing or invalid fields' });

  db_actions.getOne({
    from: models.USER,
    query: { email: body.email }
  }, (err, user_data) => {
    // an error occurred while searching for user
    if (err) {
      console.log(err)
      return res.status(500).json({ message: 'An error has occurred while searching for user' });
    }

    // user was not found
    if (!user_data)
      return res.status(404).json({ message: 'User not found' });

    // check if user is an admin
    if(user_data.role !== roles.ADMIN) 
      return res.status(401).json({ message: "Unauthorized login attempt" })


    // compare the passwords return user data with a token if they match 
    if (compare_passwords(body.password, user_data.password)) {
      let response = {
        ...JSON.parse(JSON.stringify(user_data)),
        token: generate_token(user_data)
      }
      res.json(response)
    }
    // return err response if invalid password
    else
      res.status(401).json({ message: 'invalid password' })

  })

}


module.exports = login_admin;