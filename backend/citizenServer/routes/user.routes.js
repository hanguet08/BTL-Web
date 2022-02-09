const { authJwt } = require("../middlewares");
const userController = require("../controllers/user.controller");
const controller = require("../controllers/auth.controller");
const { verifySignUp } = require("../middlewares");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });




  //A1 sau khi đăng nhập thành công thì có thể cấp tài khoản cho A2
  app.post("/A2",
    [
      authJwt.verifyToken, authJwt.isA1,
      verifySignUp.checkDuplicateUsername,
      verifySignUp.checkRolesExisted,
      verifySignUp.checkValidpassword

    ],
    controller.signupA2
  );





  //A2 sau khi đăng nhập thành công thì có thể cấp tài khoản cho A3
  app.post("/A3",
    [
      authJwt.verifyToken,
      authJwt.checkTime2Work,
      authJwt.isA2,
      verifySignUp.checkDuplicateUsername,
      verifySignUp.checkRolesExisted,
      verifySignUp.checkValidpassword

    ],
    controller.signupA3
  );



  //A3 sau khi đăng nhập thành công thì có thể cấp tài khoản cho B1
  app.post("/B1",
    [
      //xác nhận đăng nhập
      authJwt.verifyToken,
      //xác nhận là A3
      authJwt.isA3,
      authJwt.checkTime2Work,
      verifySignUp.checkDuplicateUsername,
      verifySignUp.checkRolesExisted,
      verifySignUp.checkValidpassword

    ],
    controller.signupB1
  );




  //B1 sau khi đăng nhập thành công thì có thể cấp tài khoản cho B2
  app.post("/B2",
    [
      authJwt.verifyToken, authJwt.isB1,
      verifySignUp.checkDuplicateUsername,
      verifySignUp.checkRolesExisted,
      authJwt.checkTime2Work,
      verifySignUp.checkValidpassword
    ],
    controller.signupB2
  );


  //signin 
  app.post("/signin", controller.signin);


  app.get("/account",
    [
      authJwt.verifyToken
    ],
    userController.getAccount2);


  app.put("/account", [
    authJwt.verifyToken,
    verifySignUp.checkPasswordConfirm,
    verifySignUp.checkValidpassword
  ],
    userController.changePassword

  )

  app.post("/completeTheWork",
    [
      authJwt.verifyToken,
      authJwt.isB1
    ],
    userController.completeTheWork)




 
};



