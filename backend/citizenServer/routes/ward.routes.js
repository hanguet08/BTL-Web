const { authJwt, checkWard, verifySignUp } = require("../middlewares");
const wardController = require("../controllers/ward.controller")
const userController = require("../controllers/user.controller")
module.exports = function (app) {

    //cấp mã.
    app.post("/ward",
        [
            authJwt.verifyToken, authJwt.isA3,
            authJwt.checkTime2Work,
            checkWard.checkDuplicateWard,
            checkWard.checkDuplicateWardID,
           // checkWard.checkValidWardID
        ],
        wardController.postWard

    );

    //xóa mã: truyền vào wardID.// xu li khi xoa ma thi xoas tai khoan hay khong?
    app.delete("/ward",
        [
            authJwt.verifyToken,
            authJwt.checkTime2Work,
            authJwt.isA3,
            checkWard.checkWardExistedByWardID
        ],
        wardController.deleteWard

    )
    app.put("/ward",
        [
            authJwt.verifyToken, authJwt.isA3,
            authJwt.checkTime2Work,
            checkWard.checkValidWardID,
            checkWard.checkWardExisted,
            checkWard.checkDuplicateWardID,
            verifySignUp.checkValidpassword,
            checkWard.checkPasswordConfirmWard

        ],
        wardController.putWard
    )

    app.post("/completeTheWork", [authJwt.verifyToken, authJwt.isB1], userController.completeTheWork)



}