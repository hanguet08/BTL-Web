const { authJwt, checkDistrict, verifySignUp } = require("../middlewares");
const districtController = require("../controllers/district.controller")

//routes
module.exports = function (app) {

    //cấp mã.
    app.post("/district",
        [
            authJwt.verifyToken, 
            authJwt.checkTime2Work,
            authJwt.isA2,
            checkDistrict.checkValidDistrictID,
            checkDistrict.checkDuplicateDistrictID,
            //checkDistrict.checkDuplicateDistrict,
            
        ],
        districtController.postDistrict
    );

    //xóa mã: truyền vào disctrictID.. xuw lis them khi xao ma thi xoa tai khoan khong.
    app.delete("/district",
        [authJwt.verifyToken, 
            authJwt.isA2, 
            authJwt.checkTime2Work,
            checkDistrict.checkDistrictExistedByDistrictID],
        districtController.deleteDistrict
    )

    app.put("/district", 
    [authJwt.verifyToken, 
        authJwt.isA2,
        authJwt.checkTime2Work,
        checkDistrict.checkDistrictExisted,
        checkDistrict.checkValidDistrictID,
        checkDistrict.checkDuplicateDistrictID,
        verifySignUp.checkValidpassword,
        checkDistrict.checkPasswordConfirmDistrict
    ],
    districtController.putDistrict
    )
}