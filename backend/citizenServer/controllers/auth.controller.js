const config = require("../config/auth.config")
const db = require("../models");
const User = db.user;
const Role = db.role;
const City = db.city;
const District = db.district;
const Ward = db.ward;
const Village = db.village;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { village } = require("../models");





// tạo tài khoản A2
exports.signupA2 = (req, res) => {

    const user = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      timeStart: req.body.timeStart,
      timeFinish: req.body.timeFinish,
      complete: 0,
    });

    var currentTime = new Date();
    if (req.body.timeStart && req.body.timeFinish) {
      var time1 = new Date(req.body.timeStart);
      var time2 = new Date(req.body.timeFinish);
      if (time1 <= currentTime && currentTime <= time2) {
        user.active = 1
      }
      else {
        user.active = 0
      }
    }

    User.findById(req.userId).exec((err, temp) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      user.createBy = temp.username
    })

    Role.findOne({ name: "A2" }, (err, role) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      user.roles = [role._id];

      City.findOne({ cityID: req.body.username }, (err, city) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (city) {
          user.city = city._id;
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "User was registered successfully!" });
          });
        }
        else {
          res.status(400).send({ message: "Thành phố/tỉnh này chưa được cấp mã nên không thể cấp tài khoản." })
        }


      });
    });

};

// tạo tài khoản A3
exports.signupA3 = (req, res) => {
 
    const user = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      timeStart: req.body.timeStart,
      timeFinish: req.body.timeFinish,
      complete: 0
    });


    var currentTime = new Date();
    if (req.body.timeStart && req.body.timeFinish) {
      var time1 = new Date(req.body.timeStart);
      var time2 = new Date(req.body.timeFinish);
      if (time1 <= currentTime && currentTime <= time2) {
        user.active = 1
      }
      else {
        user.active = 0
      }
    }

    User.findById(req.userId).exec((err, temp) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      user.createBy = temp.username;
    })

    Role.findOne({ name: "A3" }, (err, role) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      user.roles = [role._id];

      District.findOne({ districtID: req.body.username }, (err, district) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (district) {
          user.district = district._id;
          user.city = district.city
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "User was registered successfully!" });
          });
        }
        else {
          res.status(400).send({ message: "Quận/huyện này chưa được cấp mã nên không thể cấp tài khoản." })

        }


      });
    });
  
};


//tạo tài khoản cho B1
exports.signupB1 = (req, res) => {
    const user = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      timeStart: req.body.timeStart,
      timeFinish: req.body.timeFinish,
      complete: 0
    });


    var currentTime = new Date();
    if (req.body.timeStart && req.body.timeFinish) {
      var time1 = new Date(req.body.timeStart);
      var time2 = new Date(req.body.timeFinish);
      if (time1 <= currentTime && currentTime <= time2) {
        user.active = 1
      }
      else {
        user.active = 0
      }
    }

    User.findById(req.userId).exec((err, temp) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      user.createBy = temp.username
    })

    Role.findOne({ name: "B1" }, (err, role) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      user.roles = [role._id];

      Ward.findOne({ wardID: req.body.username }, (err, ward) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (ward) {
          user.ward = ward._id;
          user.city = ward.city;
          user.district = ward.district;
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "User was registered successfully!" });
          });
        }
        else {
          res.status(400).send({ message: "Xã/phường này chưa được cấp mã nên không thể cấp tài khoản" })
        }


      });
    });
};

//tạo tài khoản cho B2
exports.signupB2 = (req, res) => {
    const user = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      timeStart: req.body.timeStart,
      timeFinish: req.body.timeFinish
    });

    var currentTime = new Date();
    if (req.body.timeStart && req.body.timeFinish) {
      var time1 = new Date(req.body.timeStart);
      var time2 = new Date(req.body.timeFinish);
      if (time1 <= currentTime && currentTime <= time2) {
        user.active = 1
      }
      else {
        user.active = 0
      }
    }

    User.findById(req.userId).exec((err, temp) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      user.createBy = temp.username
    })

    Role.findOne({ name: "B2" }, (err, role) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      user.roles = [role._id];

      Village.findOne({ villageID: req.body.username }, (err, village) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (village) {
          user.village = village._id;
          user.city = village.city;
          user.district = village.district;
          user.ward = village.ward;
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "User was registered successfully!" });
          });
        }
        else {
          res.status(400).send({ message: "Làng/xóm này chưa được cấp mã nên không thể cấp tài khoản." })
        }


      });
    });
 
};



// cập nhập thời hian hoạt động của các tài khoản.
function updateActiveField() {
  var currentTime = new Date();

  //kiểm tra và cập nhập thời gian hoạt động của từng tài khoản.
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
         
        });
      }
    });
  });


  //kiểm tra và cập nhập thời gian hoạt động của những tài khoản cấp dưới khi tài khoản cấp trên đã hết thời gian hoạt động.
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
           
            });
          })
        })
      }
    });
  });
}


//xử lý đăng nhập
exports.signin = (req, res) => {


  //kiểm tra thời gian hoạt động của tài khoản
  updateActiveField();


  //tìm kiếm tài khoản trong database
  User.findOne({
    username: req.body.username
  })
    .populate("roles")
    .populate("city")
    .populate("district")
    .populate("ward")
    .populate("village")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

    //kiểm tra mật khẩu.
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      //nếu mật khẩu chính xác --> cấp token
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 14400 // 4 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push(user.roles[i].name.toUpperCase());

      }
      var city_name = ""
      var district_name = ""
      var ward_name = ""
      var village_name = ""
      if (user.city) {
        city_name = user.city.cityName
      }
      if (user.district) {
        district_name = user.district.districtName
      }
      if (user.ward) {
        ward_name = user.ward.wardName
      }
      if (user.village) {
        village_name = user.village.villageName
      }

      //trả về thông tin của tài khoản sau khi đăng nhập thành công.
      res.status(200).send({
        id: user._id,
        username: user.username,
        roles: authorities,
        createBy: user.createBy,
        timeStart: user.timeStart,
        timeFinish: user.timeFinish,
        city: city_name,
        district: district_name,
        ward: ward_name,
        village: village_name,
        accessToken: token,
        isActive: user.active,
        isComplete: user.complete
      });
   
    });
};



