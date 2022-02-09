const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};


//veryfy user A1
isA1 = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "A1") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require A1 Role!" });
        return;
      }
    );
  });
};


// verify user A2
isA2 = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "A2") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require A2 Role!" });
        return;
      }
    );
  });
};



//verify user A3
isA3 = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "A3") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require A3 Role!" });
        return;
      }
    );
  });
};


//verify user B1
isB1 = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "B1") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require B1 Role!" });
        return;
      }
    );
  });
};


//verify user B2
isB2 = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "B2") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require B2 Role!" });
        return;
      }
    );
  });
};

isB2orB1 = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "B2" || roles[i].name === "B1") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require B2 Role!" });
        return;
      }
    );
  });
};

checkTime2Work = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if(user.active == 1) {
      next();
    }
    else {
      res.status(403).send({ message: "time up!" });
      return;
    }
   
  })
}
const authJwt = {
  verifyToken,
  isA1,
  isA2,
  isA3,
  isB1,
  isB2,
  isB2orB1,
  checkTime2Work
};
module.exports = authJwt;


  
