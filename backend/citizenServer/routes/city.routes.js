const { authJwt, checkCity, verifySignUp } = require("../middlewares");
const cityController = require("../controllers/city.controller");



//routes
module.exports = function (app) {

    //cấp mã.
    app.post("/city",
        [
            authJwt.verifyToken, 
            authJwt.checkTime2Work,
            authJwt.isA1,
            checkCity.checkDuplicateCity,
            checkCity.checkDuplicateCityID,
            checkCity.checkValidCityID
            
        ],
        cityController.postCity

    );

    //xóa mã: truyền vào _id.
    app.delete("/city",
        [
            authJwt.verifyToken,
            authJwt.checkTime2Work, 
            authJwt.isA1, 
            checkCity.checkCityExistedByCityID,
            
        ],
        cityController.deleteCity
    )

    //sửa: 

    app.put("/city",
        [
            authJwt.verifyToken, 
            authJwt.isA1, 
            checkCity.checkValidCityID,
            checkCity.checkDuplicateCityID,
            checkCity.checkDuplicateCity,
            checkCity.checkCityExisted,
            checkCity.checkPasswordConfirmCity,
            verifySignUp.checkValidpassword,
            

           
        ],
        cityController.putCity
    )
}
