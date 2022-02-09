const { district } = require("../models");
const db = require("../models");
const City = db.city;
const District = db.district;
const Ward = db.ward;
const Village = db.village;
const User = db.user


//xoa het huyện/ quận liên quan
function deleteDistricts(regex){
  District.deleteMany({ districtID: regex })
  .exec((err, districts) => {
    if (err) {
      console.log(err)
      return;
    }
    console.log("delete all districts were created");

  })
}

//xoa het xa/phuong lien quan
function deleteWards(regex){
  Ward.deleteMany({ wardID: regex })
  .exec((err, wards) => {
    if (err) {
      console.log(err)
      return;
    }
    console.log("delete all wards were created");

  })
}

//xoa het lang lien quan

function deleteVillages(regex){
  Village.deleteMany({ villageID: regex })
  .exec((err, villages) => {
    if (err) {
      console.log(err)
      return;
    }
    console.log("delete all villages were created");

  })
}

//sua het district lien quan khi nguoi dung sua cityID
function putDistricts(regex, ID) {
  District.find({districtID: regex})
  .exec((err, districts) => {
    if (err) {
      console.log(err)
      return;
    }
    districts.forEach(district => {
      var oldID = district.districtID
      var newID = oldID.replace(regex,ID)
      console.log(newID)
      district.districtID = newID
      district.save(err => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("cap nhat districtID thanh cong")
      });
    });
  })
}


//sua het ward lien quan khi nguoi dung sua cityID/districtID
function putWards(regex, ID) {
  Ward.find({wardID: regex})
  .exec((err, wards) => {
    if (err) {
      console.log(err)
      return;
    }
    wards.forEach(ward => {
      var oldID = ward.wardID
      var newID = oldID.replace(regex,ID)
      console.log(newID)
      ward.wardID = newID
      ward.save(err => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("cap nhat wardID thanh cong")
      });

    });
  })
}

//sua het village lien quan khi nguoi dung sua cityID/districtID 
function putVillages(regex, ID) {
  Village.find({villageID: regex})
  .exec((err, villages) => {
    if (err) {
      console.log(err)
      return;
    }
    villages.forEach(village => {
      var oldID = village.villageID
      var newID = oldID.replace(regex, ID)
      console.log(newID)
      village.villageID = newID
      village.save(err => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("cap nhat villageID thanh cong")
      });

    });
  })
}

function getDistrict(city_id) {
var list 
  District.find({ city: city_id })
    .exec((err, districts) => {
      list = {districts: district.name}
    })
    return list;
    console.log(list)
}

exports.getLocation = (req, res) => {
  User.findById(req.userId).exec((err, user) => {
      if (err) {
          res.status(500).send({ message: err });
          return;
      }
      //check city account
      re1 = "^[0-9]{2}$"
      regex1 = new RegExp(re1, "g")

      //check district account
      re2 = "^[0-9]{4}$"
      regex2 = new RegExp(re2, "g")

      //check ward account
      re3 = "^[0-9]{6}$"
      regex3 = new RegExp(re3, "g")

      //check village account
      re4 = "^[0-9]{8}$"
      regex4 = new RegExp(re4, "g")

      //get citizens of city.
      if (user.username.match(regex1)) {
        District.find({city: user.city}).exec((err,districts)=> {

        })
          
      }


      //get citizens of district
      else if (user.username.match(regex2)) {
          

      }


      //get citizens of ward
      else if (user.username.match(regex3)) {
          
      }

      //get citizens of village
      else if (user.username.match(regex4)) {
          
      }
      //get all citizens
      else {
          
      }

  })
}

const locationController = {
  deleteDistricts,
  deleteVillages, 
  deleteWards,
  putDistricts, 
  putWards,
  putVillages
 
};

module.exports = locationController;


