const db = require("../models");
const City = db.city;
const User = db.user;
const locationController = require('./location.controller');
const userController = require('./user.controller');
const citizenController = require('./citizen.controller')
const verifySignUp = require("../middlewares")

exports.postCity = (req, res) => {


    const city = new City({
        cityID: req.body.cityID,
        cityName: req.body.cityName
    });

    city.save((err, city) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send(city);
    })

}

exports.deleteCity = (req, res) => {
    var re = "^";
    var result = re.concat(req.body.cityID)
    var regex = new RegExp(result, "g")

    City.findOneAndDelete({ cityID: req.body.cityID })
        .exec((err, city) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            citizenController.deleteCitizensOfCity(city._id);

        })

    locationController.deleteDistricts(regex);
    locationController.deleteVillages(regex);
    locationController.deleteWards(regex);
    userController.deleteUsers(regex);


    res.send({ message: "City was deleted" });
}

exports.putCity = (req, res) => {
    City.findById(req.body._id)
        .exec((err, city) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (city) {
                if (req.body.password && req.body.password_confirm) {
                    userController.editUser_password(city.cityID, req.body.password, req.body.password_confirm)
                }

                if (req.body.timeStart && req.body.timeFinish) {
                    userController.editUser_time(city.cityID, req.body.timeStart, req.body.timeFinish)
                }

                if (req.body.cityID) {
                    var re = "^";
                    var result = re.concat(city.cityID)
                    var regex = new RegExp(result, "g")
                    city.cityID = req.body.cityID;
                    locationController.putDistricts(regex, req.body.cityID)
                    locationController.putWards(regex, req.body.cityID)
                    locationController.putVillages(regex, req.body.cityID)
                    userController.editUsers_username(regex, req.body.cityID)

                }

                if (req.body.cityName) {
                    city.cityName = req.body.cityName;
                }
                city.save(err => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    res.status(200).send({message: "Chỉnh sửa thành công"});
                })

            }
            else {
                res.status(400).send({message: "loi"})
            }
        })


}
