
module.exports=()=>{
    const MongoClient = require('mongodb').MongoClient;
//Adem54:Sakarya5466
// replace the uri string with your connection string.
//mongodb+srv://Adem54:<password>@cluster0-x0fvc.mongodb.net/test?retryWrites=true&w=majority
const uri = "mongodb+srv://Adem54:Sakarya5466@cluster0-x0fvc.mongodb.net/test?retryWrites=true&w=majority"
const database_name="test";
let database,collection;

MongoClient.connect(uri,{useNewUrlParser:true, useUnifiedTopology: true } ,function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   //database=client.db(database_name);
   //collection=database.collection("book");
   console.log('Connected... `' + database_name + '`!');
 
  
   client.close();
});
}

/* 
module.exports=()=>{
    const MongoClient = require('mongodb').MongoClient;
//Adem54:Sakarya5466
// replace the uri string with your connection string.
//mongodb+srv://Adem54:<password>@cluster0-x0fvc.mongodb.net/test?retryWrites=true&w=majority
const uri = "mongodb+srv://Adem54:Sakarya5466@cluster0-x0fvc.mongodb.net/test?retryWrites=true&w=majority"
const database_name="test";
let database,collection;

MongoClient.connect(uri,{useNewUrlParser:true, useUnifiedTopology: true } ,function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   database=client.db(database_name);
   collection=database.collection("book");
   console.log('Connected... `' + database_name + '`!');
 
  
   client.close();
});
}


*/


/* 
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('MongoDB Connected.');
  } catch (error) {
    console.error(error.message);
    // Exit process with failure
    process.exit(1);
  }
};
module.exports = connectDB;

*/