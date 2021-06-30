const mongoose = require("mongoose");

// const mongo_uri = process.env.MONGO_URI;
const mongo_uri = "mongodb://127.0.0.1:27017/vra?compressors=zlib&gssapiServiceName=mongodb&DatabaseName=vra";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}


// TODO: retry the connection again for the next 5 times
exports.connect = () => {
  mongoose.connect(mongo_uri, options).then(() => {
    console.log("database connection successfull");
  }).catch(err => {
    console.trace(err);
  })
}