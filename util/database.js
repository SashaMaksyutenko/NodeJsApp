const mongoDB = require("mongodb");
const MongoClient = mongoDB.MongoClient;
let _db;
const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://sashamaksyutenko:7Alm9KVFRzXGBjzR@cluster0.jevii2h.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
    .then((client) => {
      console.log("Connected to db!");
      _db=client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};
const getDb=()=>{
  if(_db){
    return _db;
  }
  throw 'No DataBase found';
}
exports.mongoConnect=mongoConnect;
exports.getDb=getDb;
