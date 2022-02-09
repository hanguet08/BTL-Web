const db = require("../models");
var bcrypt = require("bcryptjs");
const City = db.city;
const User = db.user;



//kiểm tra trùng lặp thành phố
checkDuplicateCity = (req, res, next) => {
    // cityname
   
        City.findOne({
        cityName: req.body.cityName,
    }).exec((err, city) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (city) {
            res.status(400).send({ message: "Failed! cityName is already exited!" });
            return;
        }
        next();
    });
    
    
};

//kiểm tra trùng lặp mã
checkDuplicateCityID = (req, res, next) => {
    // cityID
   
        City.findOne({
        cityID: req.body.cityID,
    }).exec((err, city) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (city) {
            res.status(400).send({ message: "Failed! cityID is already exited!" });
            return;
        }
        next();
    });
    
    
};

//kiểm tra tồn tại thành phố/ tỉnh hay không:
checkCityExisted = (req, res, next) => {
    // cityID
    
        City.findById(req.body._id).exec((err, city) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!city) {
            res.status(400).send({ message: "Failed! _id is not exited!" });
            return;
        }
        next();
    });
    
    
};

checkCityExistedByCityID = (req, res, next) => {
    // cityID
    
        City.findOne({cityID: req.body.cityID}).exec((err, city) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!city) {
            res.status(400).send({ message: "Failed! cityID is not exited!" });
            return;
        }
        next();
    });
    
    
};

checkValidCityID = (req, res, next) => {
    re = "^[0-9]{2}$"
    regex = new RegExp(re, "g")
    if(req.body.cityID) {
        if(req.body.cityID.match(regex)) {
            next();
        }
        else {
            res.status(400).send({message: "mã của tỉnh/thành phố không đúng dịnh dạng"});
            return;
        }
    }
    else {
        next();
    }
}

checkCityNameExisted = (req,res,next) => {
    if(req.body.cityName)
    {
        City.findOne({
        cityName: req.body.cityName,
    }).exec((err, city) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (!city) {
            res.status(400).send({ message: "Không tìm thấy tên tỉnh/thành phố" });
            return;
        }
        next();
    });
    }
    else {
        next()
    }
    
}

checkPasswordConfirmCity = (req,res, next)=> {
    if(req.body.password_confirm && req.body.password) {
      City.findById(req.body._id).exec((err, city) => {
        User.findOne({username: city.cityID}).exec((err, user) => {
          if(user){
            var passwordIsValid = bcrypt.compareSync(
              req.body.password_confirm,
              user.password
            );
      
            if (!passwordIsValid) {
              return res.status(401).send({
                message: "Mật khẩu cũ không chính xác. Vui lòng kiểm tra lại!"
              });
            }
            else {
              next();
            }
          }
        })
      })
    }
    
    else {
      next()
    }
    
  }
  



const checkCity = {
    checkDuplicateCity,
    checkDuplicateCityID,
    checkCityExisted,
    checkCityExistedByCityID,
    checkValidCityID,
    checkCityNameExisted,
    checkPasswordConfirmCity
   
  };
  
module.exports = checkCity;