const db = require("../models");
var bcrypt = require("bcryptjs");
const City = require("../models/city.model");
const District = require("../models/district.model");
const Ward = require("../models/ward.model");
const Village = require("../models/village.model")
const User = db.user;
const Role = db.role;

//get list of user.
exports.getAccount = (req, res) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      User.find({ createBy: user.username })
        .populate("roles")
        .exec((err, users) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.status(200).send(
          User.aggregate(
            [
              {
                $project: {
                   timeStart: { $dateToString: { format: "%m-%d-%Y", date: "$timeStart" } },
                   
                }
              }
            ]
         )
          );

        })
       

    }
    else {
      res.send({ message: "loi" })
    }

  });
};


exports.getAccount2 = (req, res) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      //check city account
      re1 = "^[0-9]{2}$"
      regex1 = new RegExp(re1, "g")

      //check district account
      re2 = "^[0-9]{4}$"
      regex2 = new RegExp(re2, "g")

      //check ward account
      re3 = "^[0-9]{6}$"
      regex3 = new RegExp(re3, "g")

    
      if (user.username.match(regex1)) {
        District.find({city: user.city})
        .exec((err, districts) => {
          var account = [];
          var location = [];
          var sum = 0
       
          if(districts[0]){
            districts.forEach(district => {

              User.findOne({  username: district.districtID })
                .populate("roles")
                .populate("city")
                .populate("district")
                .exec((err, user) => {
                  
                  sum += 1;
                  if (user) {
                    account.push(user)
                  }
                  else {
                   location.push(district)
                  }
                  //list.push(element);
                  //console.log(sum + "   " + districts.length)
                  if (districts.length == sum) {
                    res.status(200).send({
                      location:location, 
                      account: account
                    })
                  }
                })
            });
          }
          else {
            res.status(400).send({
              location:location, 
              account: account
            })
          }
          
        })
      }

      else if (user.username.match(regex2)) {
        Ward.find({district: user.district})
        .exec((err, wards) => {
          var account = [];
          var location = [];
          var sum = 0
          if(wards[0]){
            wards.forEach(ward => {
              User.findOne({ username: ward.wardID })
              .populate("roles")
              .populate("city")
              .populate("district")
              .populate("ward")
         
                .exec((err, user) => {
                  sum += 1;
                  if (user) {
                    account.push(user)
                  }
                  else {
                    
                   location.push(ward)
                  }
                  //console.log(sum + "   " + districts.length)
                  if (wards.length == sum) {
                    res.status(200).send({
                      location:location, 
                      account: account
                    })
                  }
                })
            });

          }
          else{
            res.send({location:location, 
              account: account})
          }
          
        })
      }
      else if (user.username.match(regex3)) {
        Village.find({ward: user.ward})
        .exec((err, villages) => {
          var account = [];
          var location = [];
          var sum = 0
          if(villages[0]){

            villages.forEach(village => {
              User.findOne({ username: village.villageID })
              .populate("roles")
              .populate("city")
              .populate("district")
              .populate("ward")
              .populate("village")
                .exec((err, user) => {
                  sum += 1;
                  if (user) {
                    account.push(user)
                  }
                  else {
                   location.push(village)
                  }
                  
                  //console.log(sum + "   " + districts.length)
                  if (villages.length == sum) {
                    res.status(200).send({
                      location:location, 
                      account: account
                    })
                  }
                })
            });
          }
          else {
            res.status(400).send({
              location:location, 
              account: account
            })
          }
         
        })
      }

      else {
        City.find()
        .exec((err, citis) => {
          var account = [];
          var location = [];
          var sum = 0
          citis.forEach(city => {
            User.findOne({ username: city.cityID })
            .populate("roles")
            .populate("city")
              .exec((err, user) => {
                sum += 1;
                if (user) {
                  account.push(user)
                }
                else {
                 location.push(city)
                }
                //console.log(sum + "   " + citis.length)
                if (citis.length == sum) {
                  res.status(200).send({
                    location:location, 
                    account: account
                  })
                }
              })
          });
        })

      }

    }
    else {
      res.send({ message: "loi" })
    }

  });
}

//xoa nhung tai khoan lien quan
exports.deleteUsers = (regex) => {
  User.deleteMany({ username: regex })
    .exec((err, users) => {
      if (err) {
        console.log(err)
        return;
      }
      console.log("delete all user were created");

    })
}


//sua het user anh huong khi mã tinh/huyện/xa/lang thay doi
exports.editUsers_username = (regex, ID) => {
  User.find({ username: regex })
    .exec((err, users) => {
      if (err) {
        console.log(err)
        return;
      }
      users.forEach(user => {
        var oldUsername = user.username
        var newUsername = oldUsername.replace(regex, ID)
        user.username = newUsername
        var oldCreateBy = user.createBy
        var newCreateBy = oldCreateBy.replace(regex, ID)
        user.createBy = newCreateBy


        user.save(err => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("cap nhat users thanh cong")
        });

      });
    })
}

//sửa password
exports.editUser_password = (ID, newPassword) => {
  User.findOne({ username: ID })
    .exec((err, user) => {
      if (err) {
        console.log(err)
        return;
      }
      if (user) {
        user.password = bcrypt.hashSync(newPassword, 8)

        user.save(err => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("cap nhat pass thanh cong")
        });
        
        
      }

    })
}

//sửa time hoạt động
exports.editUser_time = (ID, newTimeStart, newTimeFinish) => {
  User.findOne({ username: ID })
    .exec((err, user) => {
      if (err) {
        console.log(err)
        return;
      }
      if (user) {
        console.log("tim thay user")
        user.timeStart = newTimeStart;
        user.timeFinish = newTimeFinish;
        //check active
        var currentTime = new Date();
        var time1 = new Date(newTimeStart);
        var time2 = new Date(newTimeFinish);
        if (time1 <= currentTime && currentTime <= time2) {
          user.active = 1
        }
        else {
          user.active = 0
        }
        user.save(err => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("cap nhat time thanh cong")
        });
      }

    })
}


//B1 update hoàn thành công việc khai báo cư dân.
exports.completeTheWork = (req, res) => {
  if (req.body.completeTheWork == 1 ||req.body.completeTheWork == 0 ) {
    User.findByIdAndUpdate(req.userId, { complete: req.body.completeTheWork }, function (err, user) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }


      User.find({})
        .populate("roles")
        .exec((err, users) => {
          if (err) {
            console.log("loi");
            return;
          }
          users.forEach(function (user) {

            if (user.roles[0].name == "A3") {
              User.find({ createBy: user.username }).exec((err, arr) => {
                ok = true;
                if(arr[0]){
                  arr.forEach(element => {
                    if (element.complete == 0) {
                      ok = false;
                    }
                  });
                }
                else {
                  ok = false;
                }
                
                if (ok == true) {
                  user.complete = 1;
                }
                else {
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
        });

      User.find({})
        .populate("roles")
        .exec((err, users) => {
          if (err) {
            console.log("loi");
            return;
          }
          users.forEach(function (user) {

            if (user.roles[0].name == "A2") {
              User.find({ createBy: user.username }).exec((err, arr) => {
                ok = true;
                if(arr[0]){
                  arr.forEach(element => {
                    if (element.complete == 0) {
                      ok = false;
                    }
                  });

                }
                else{
                  ok = false;
                }
               
                if (ok == true) {
                  user.complete = 1;
                }
                else {
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
        });
      res.status(200).send({ message: "cập nhật complete thành công" })
    })
  }
}


exports.changePassword =(req,res) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      console.log(err)
      return;
    }
    if(user){
      user.password = bcrypt.hashSync(req.body.password, 8)
      user.save(err => {
        if (err) {
          console.log(err);
          return;
        }
      res.status(200).send({message: "Sửa mật khẩu thành công"})
      });
    }
    
  })
}




