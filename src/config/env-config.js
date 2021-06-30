const path = require("path");

// load environment variables if in development mode
if (process.env.NODE_ENV == "development") {
  require('dotenv').config({ path: path.join((__dirname, '.env')) });
}
