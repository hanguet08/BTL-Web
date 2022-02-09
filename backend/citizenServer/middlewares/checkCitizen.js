const db = require("../models");
const Citizen = db.citizen;

//kiểm tra trùng lặp cư dân - kiểm tra citizenID
checkDuplicateCitizenID = (req, res, next) => {
    // CitizenID
    Citizen.findOne({
        citizenID: req.body.citizenID,
    }).exec((err, citizen) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (citizen) {
            res.status(400).send({ message: "Failed! citizenID is already exited!" });
            return;
        }
        next();
    });
};

//kiểm tra tồn tại thành phố/ tỉnh hay không:
checkCitizenExisted = (req, res, next) => {
    // CitizenID
    Citizen.findOne({
        citizenID: req.body.citizenID,
    }).exec((err, citizen) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!citizen) {
            res.status(400).send({ message: "Failed! citizenID is not exited!" });
            return;
        }
        next();
    });
};

checkCitizenExistedById = (req, res, next) => {
    // CitizenID
    Citizen.findById(req.body._id).exec((err, citizen) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!citizen) {
            res.status(400).send({ message: "Failed! citizen is not exited!" });
            return;
        }
        next();
    });
};

const checkCitizen = {
    checkDuplicateCitizenID,
    checkCitizenExisted,
    checkCitizenExistedById

};

module.exports = checkCitizen;