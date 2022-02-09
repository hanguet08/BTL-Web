const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dbConfig = require("./config/db.config");

// set up server
const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:8080'],
  
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Hello!" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is runing on port ${PORT}`);
});

// connect database
const db = require("./models");
const { count } = require("./models/user.model");
const Role = db.role;
const User = db.user;

mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });


// routes

require("./routes/user.routes")(app);
require("./routes/city.routes")(app);
require("./routes/district.routes")(app);
require("./routes/ward.routes")(app);
require("./routes/village.routes")(app);
require("./routes/citizen.routes")(app);

// connect success create collection in database
function initial() {

//kiểm tra thời gian làm việc và cập nhập vào database
  var currentTime = new Date();
  console.log(currentTime)
  User.find({}).exec((err, users) => {
    if (err) {
      console.log("loi");
      return;
    }

    users.forEach(function (user) {
      if (user.timeStart && user.timeFinish) {
        var time1 = new Date(user.timeStart);
        var time2 = new Date(user.timeFinish);
        if (time1 <= currentTime && currentTime <= time2) {
          user.active = 1
        }
        else {
          user.active = 0;
        }

        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          //console.log("cap nhat thoi gian hoat dong thanh cong")
        });
      }
    });
  });


  User.find({}).exec((err, users) => {
    if (err) {
      console.log("loi");
      return;
    }

    users.forEach(function (user) {
      if (user.active == 0) {
        User.find({ createBy: user.username }).exec((err, arr) => {
          if (err) {
            console.log("loi");
            return;
          }
          arr.forEach(function (temp) {
            temp.active = 0;
            temp.save(err => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              // console.log("thanh cong")
            });
          })
        })
      }
    });
  });

 
  /*
  User.find({}).exec((err, users) => {
    if (err) {
      console.log("loi");
      return;
    }
    users.forEach(function (user) {

      if(user.roles[0].name == "A3" || user.roles[0].name == "A2")
      {
        User.find({createBy: user.username}).exec((err, arr) => {
          ok = true;
          arr.forEach(element => {
            if(element.complete == 0)
            {
              ok = false;
            }
          });
          if(ok == true) {
            user.complete = 1;
          }
          else{
            user.complete = 0;
          }
          user.save(err => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
            });
        })
      }
    });
  });*/
  
}


