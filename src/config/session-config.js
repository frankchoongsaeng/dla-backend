const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);


//==============================================================
var store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'user_sessions',
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000
  }
});
 
// Catch errors
store.on('error', function(error) {
  console.trace(error);
});
 
module.exports = () => session({
  secret: process.env.COOKIE_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 month
  },
  store: store,
  resave: true,
  saveUninitialized: true,
});
