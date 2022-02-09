const db = require("../models");
const Ward = db.ward;
const User = db.user;
const District = db.district;
const locationController = require('./location.controller');
const userController = require('./user.controller');
const citizenController = require('./citizen.controller')


exports.postWard = (req, res) => {

    const ward = new Ward({
        wardID: req.body.wardID,
        wardName: req.body.wardName
    });
    ward.save((err, ward) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        User.findById(req.userId).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            ward.district = user.district;
            //console.log(user)
            var id = user.district;
            //console.log(id)
            District.findById(id).exec((err, district) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                ward.city = district.city;
                ward.save(err => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    res.send(ward);
                });
            })
        });

    })


}
exports.deleteWard = (req, res) => {
    var re = "^";
    var result = re.concat(req.body.wardID)
    var regax = new RegExp(result, "g")

    Ward.findOneAndDelete({ wardID: req.body.wardID })
        .exec((err, ward) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            citizenController.deleteCitizensOfWard(ward._id)

        })

    locationController.deleteVillages(regax);
    userController.deleteUsers(regax);
    res.send({ message: "ward was deleted" });
}

exports.putWard = (req, res) => {
    Ward.findById(req.body._id)
        .exec((err, ward) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (req.body.password && req.body.password_confirm) {
                userController.editUser_password(ward.wardID, req.body.password)
            }

            if (req.body.timeStart && req.body.timeFinish) {
                userController.editUser_time(ward.wardID, req.body.timeStart, req.body.timeFinish)
            }

            if (req.body.wardID) {
                var re = "^";
                var result = re.concat(ward.wardID)
                var regex = new RegExp(result, "g")
                ward.wardID = req.body.wardID;
                locationController.putVillages(regex, req.body.wardID)
                userController.editUsers_username(regex, req.body.wardID)

            }
            if (req.body.wardName) {
                ward.wardName = req.body.wardName;
            }
            ward.save(err => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                res.send({message: "Chỉnh sửa thành công"});
            })

        })

}
