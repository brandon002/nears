const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const passport = require("passport");
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://admin:Rj1dUcvAtt97CBa5@nears.xkq28kn.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var corsOptions = {
    // origin: "https://app-nears.onrender.com/",
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,

};
app.use(cors(corsOptions));
// app.use((req, res, next) => { 
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Method', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// }) 
// const db = require("./config/db.config.js");
// client.connect(db.url, db.connectOptions)
//   .then(()=>console.log("MongoDB Connected Successfuly"))
//   .catch((err)=>console.log(err));
// async function run() {
//   try {
//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     await client.close();
//   }
// }
async function run() {
  try {
    await mongoose.connect(
      `mongodb+srv://admin:Rj1dUcvAtt97CBa5@nears.xkq28kn.mongodb.net/?retryWrites=true&w=majority`, 
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      }
    );
    // await mongoose.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
run().catch(console.dir);
app.use(passport.initialize());

require("./config/passport")(passport);
require("./routes/routes.js")(app);

const PORT = 27017;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
