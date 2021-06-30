const { getMany, getOne } = require("../db");
const models = require("../constants/models");
const roles = require("../constants/roles");


function verify_query_params(params) {

  // if params is empty
  if (!params) return false;

  // missing type
  if (!params.type) return false

  // missing user_id
  if (!params.user_id) return false

  // missing customer_id if type is single
  if (params.type === 'single' && !params.customer_id) return false


  // valid query params
  return true;
}


function get_customers(req, res) {

  const query_params = req.query;

  // verify query params
  if (!verify_query_params(query_params))
    return res.status(400).json({ 'message': 'missing or invalid query params' });

  let type = query_params.type;
  let user_id = query_params.user_id;
  let customer_id = query_params.customer_id;
  let db_query = {};

  // build db query based on query params
  if (type === 'single')
    db_query._id = customer_id;


  // get the user initiating the request
  getOne({
    from: models.USER,
    query: { _id: user_id }
  }, (err, user) => {

    if (err) console.log({ err })

    // if user not found
    if (user._id != user_id) {
      return res.status(401).json({ message: 'permission denied' });
    }

    if (user.role !== roles.ADMIN) {
      res.status(401).json({ message: 'you dont have permission to request this data' });
    }

    // get all users
    if (type === 'all') {
      getMany({
        from: models.USER,
        query: { ...db_query, role: 'customer'}
      }, (_err, vehicle_data) => {
        res.json(vehicle_data);
      })
    }


    if (type === 'user') {
      getMany({
        from: models.VEHICLE,
        query: db_query
      }, (_err, vehicle_data) => {

        // send vehicle if user is owner or user is admin
        res.json(vehicle_data)

      })
    }


    if (type === 'single') {
      getOne({
        from: models.USER,
        query: db_query
      }, (_err, customer_data) => {

        // send vehicle if user is owner or user is admin
        res.json(customer_data)
      })
    }
  })

}



module.exports = get_customers;