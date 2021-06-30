// configure environment variables
// require("./env-config");

// configure database and connect database
require("./db-config").connect();


// configure passport
// require("./passport-config")


// configure session
// const sessionObject = require("./session-config");


// export configuration needed for post configuration
// i.e, when express app has been instantiated
// module.exports = {
//   session_config: sessionObject,

//   // decalre post-config objects here
// }