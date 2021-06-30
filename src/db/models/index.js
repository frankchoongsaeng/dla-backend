const {
  USER,
  VEHICLE
} = require("../../constants/models");

module.exports = {
  [USER]: require("./user"),
  [VEHICLE]: require("./vehicle"),
};