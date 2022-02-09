const db = require("../models");
var bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const District = db.district;


//kiểm tra trùng lặp thành phố
checkDuplicateDistrict = (req, res, next) => {
    // districtname
    if(req.body.districtName && req.body.districtID){
        District.findOne({
            districtName: req.body.districtName,
            districtID: req.body.districtID
        }).exec((err, district) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
    
            if (district) {
                res.status(400).send({ message: "Failed! district is already exited!" });
                return;
            }
            next();
        });
    }
    else {
next()
    }
    
};

//kiểm tra trùng lặp mã
checkDuplicateDistrictID = (req, res, next) => {
    // districtID
    if(req.body.districtID){
        District.findOne({
            districtID: req.body.districtID,
        }).exec((err, district) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
    
            if (district) {
                res.status(400).send({ message: "Failed! districtID is already exited!" });
                return;
            }
            next();
        });
    }
    else {
        next()
    }
    
};

//kiểm tra tồn tại thành phố/ tỉnh hay không:
checkDistrictExisted = (req, res, next) => {
    // districtID
    District.findById(req.body._id).exec((err, district) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!district) {
            res.status(400).send({ message: "Failed! _id is not exited!" });
            return;
        }
        next();
    });
};

checkDistrictExistedByDistrictID = (req, res, next) => {
    // districtID

    District.findOne({ districtID: req.body.districtID }).exec((err, district) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!district) {
            res.status(400).send({ message: "Failed! districtID is not exited!" });
            return;
        }
        next();
    });
};

checkValidDistrictID = (req, res, next) => {
    if(req.body.districtID){
        User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (req.body.districtID) {
            var re1 = "^";
            var re2 = "+[0-9]{2}$"
            var temp = re1.concat(user.username)
            var result = temp.concat(re2)
            if (req.body.districtID.match(result)) {
                next();
            }
            else {
                res.status(400).send({ message: "Mã phải bắt đầu bằng: " + user.username + ". Vui lòng kiểm tra lại!" })
            }
        }
    }) 
    }
    else {
        next();
    }
   
}

checkDistrictNameExisted = (req, res, next) => {
    if (req.body.districtName) {
        District.findOne({
            districtName: req.body.districtName,
        }).exec((err, district) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!district) {
                res.status(400).send({ message: "Không tìm thấy tên quận/huyện" });
                return;
            }
            next();
        });
    }
    else {
        next()
    }

}


checkPasswordConfirmDistrict = (req,res, next)=> {
    if(req.body.password_confirm && req.body.password) {
      District.findById(req.body._id).exec((err, district) => {
        User.findOne({username: district.districtID}).exec((err, user) => {
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


const checkDistrict = {
    checkDuplicateDistrict,
    checkDuplicateDistrictID,
    checkDistrictExisted,
    checkDistrictExistedByDistrictID,
    checkValidDistrictID,
    checkDistrictNameExisted,
    checkPasswordConfirmDistrict

};

module.exports = checkDistrict;