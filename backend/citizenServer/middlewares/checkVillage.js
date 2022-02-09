const db = require("../models");
var bcrypt = require("bcryptjs");
const Village = db.village;
const User = db.user;


//kiểm tra trùng lặp thành phố
checkDuplicateVillage = (req, res, next) => {
    // villageName
    Village.findOne({
        villageName: req.body.villageName,
    }).exec((err, village) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (village) {
            res.status(400).send({ message: "Failed! villageName is already exited!" });
            return;
        }
        next();
    });
};

//kiểm tra trùng lặp mã
checkDuplicateVillageID = (req, res, next) => {
    // villageID
    Village.findOne({
        villageID: req.body.villageID,
    }).exec((err, village) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (village) {
            res.status(400).send({ message: "Failed! villageID is already exited!" });
            return;
        }
        next();
    });
};

//kiểm tra tồn tại thành phố/ tỉnh hay không:
checkVillageExisted = (req, res, next) => {
    // villageID
    Village.findById(req.body._id).exec((err, village) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!village) {
            res.status(400).send({ message: "Failed! _id is not exited!" });
            return;
        }
        next();
    });
};

checkVillageExistedByVillageID = (req, res, next) => {
    // villageID
    Village.findOne({villageID: req.body.villageID}).exec((err, village) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!village) {
            res.status(400).send({ message: "Failed! villageID is not exited!" });
            return;
        }
        next();
    });
};


checkValidVillageID = (req,res,next) => {
    if(req.body.villageID){
        User.findById(req.userId).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            var name = user.username;
            re = "+[0-9]{2}$";
            result = name.concat(re);
            regex = new RegExp(result, "g")
            
               if (req.body.villageID.match(regex)) {
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

checkVillageNameExisted = (req,res,next) => {
    if(req.body.villageName)
    {
        Village.findOne({
        villageName: req.body.villageName,
    }).exec((err, village) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (!village) {
            res.status(400).send({ message: "Không tìm thấy tên làng" });
            return;
        }
        next();
    });
    }
    else {
        next();
    }
    
}


checkPasswordConfirmVillage = (req,res, next)=> {
    if(req.body.password_confirm && req.body.password) {
      Village.findById(req.body._id).exec((err, village) => {
        User.findOne({username: village.villageID}).exec((err, user) => {
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


const checkVillage = {
    checkDuplicateVillage,
    checkDuplicateVillageID,
    checkVillageExisted,
    checkVillageExistedByVillageID,
    checkValidVillageID,
    checkVillageNameExisted,
    checkPasswordConfirmVillage

};

module.exports = checkVillage;