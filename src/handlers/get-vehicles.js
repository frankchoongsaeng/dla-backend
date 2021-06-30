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

  // missing vehicle_id if type is single
  if (params.type === 'single' && !params.vehicle_id) return false


  // valid query params
  return true;
}


function get_vehicles(req, res) {

  const query_params = req.query;

  // verify query params
  if (!verify_query_params(query_params))
    return res.status(400).json({ 'message': 'missing or invalid query params' });

  let type = query_params.type;
  let user_id = query_params.user_id;
  let vehicle_id = query_params.vehicle_id;
  let db_query = {};

  // build db query based ond query params
  if (type === 'user')
    db_query.owner_id = user_id;

  if (type === 'single')
    db_query._id = vehicle_id;


  // get the user initiating the request
  getOne({
    from: models.USER,
    query: { _id: user_id }
  }, (err, user) => {

    if (err) console.log({ err })

    // if user not found
    if (user._id != user_id) {
      return res.status(404).json({ message: 'user not found' });
    }

    // only get all vehicles if user is an admin
    if (type === 'all') {
      if (user.role !== roles.ADMIN) {
        res.status(401).json({ message: 'you dont have permission to request this data' });
      }

      getMany({
        from: models.VEHICLE,
        query: db_query
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
        from: models.VEHICLE,
        query: db_query
      }, (_err, vehicle_data) => {

        // send vehicle if user is owner or user is admin
        user.role == roles.ADMIN || user._id == vehicle_data.owner_id
          ? res.json(vehicle_data)
          : res.status(401).json({ message: 'you dont have permission to request this data' });
      })
    }
  })

}



module.exports = get_vehicles;