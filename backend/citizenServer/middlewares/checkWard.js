const db = require("../models");
var bcrypt = require("bcryptjs");
const Ward = db.ward;
const User = db.user;


//kiểm tra trùng lặp thành phố
checkDuplicateWard = (req, res, next) => {
    // Wardname
    Ward.findOne({
        wardName: req.body.wardName,
    }).exec((err, ward) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (ward) {
            res.status(400).send({ message: "Failed! wardName is already exited!" });
            return;
        }
        next();
    });
};

//kiểm tra trùng lặp mã
checkDuplicateWardID = (req, res, next) => {
    // wardID
    if(req.body.wardID)
    {
        Ward.findOne({
            wardID: req.body.wardID,
        }).exec((err, ward) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
    
            if (ward) {
                res.status(400).send({ message: "Failed! wardID is already exited!" });
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
checkWardExisted = (req, res, next) => {
    // wardID
    Ward.findById(req.body._id).exec((err, ward) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!ward) {
            res.status(400).send({ message: "Failed! _id is not exited!" });
            return;
        }
        next();
    });
};

checkWardExistedByWardID = (req, res, next) => {
    // wardID
    Ward.findOne({ wardID: req.body.wardID }).exec((err, ward) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!ward) {
            res.status(400).send({ message: "Failed! wardID is not exited!" });
            return;
        }
        next();
    });
};

checkValidWardID = (req, res, next) => {
if(req.body.wardID){
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        var name = user.username;
        re = "+[0-9]{2}$";
        result = name.concat(re);
        regex = new RegExp(result, "g")
        
            if (req.body.wardID.match(regex)) {
                next();
            }
            else {
                res.status(400).send({ message: "Mã phải bắt đầu bằng: " + name + ". Vui lòng kiểm tra lại!" })
            }
        
    })
}
else {
    next();
}
    
}

checkWardNameExisted = (req, res, next) => {
    if (req.body.wardName) {
        Ward.findOne({
            wardName: req.body.wardName,
        }).exec((err, ward) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!ward) {
                res.status(400).send({ message: "Không tìm thấy tên xã/phường" });
                return;
            }
            next();
        });
    }
    else {
        next();
    }

}


checkPasswordConfirmWard = (req,res, next)=> {
    if(req.body.password_confirm && req.body.password) {
      Ward.findById(req.body._id).exec((err, ward) => {
        User.findOne({username: ward.wardID}).exec((err, user) => {
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

const checkWard = {
    checkDuplicateWard,
    checkDuplicateWardID,
    checkWardExisted,
    checkWardExistedByWardID,
    checkValidWardID,
    checkWardNameExisted,
    checkPasswordConfirmWard

};

module.exports = checkWard;