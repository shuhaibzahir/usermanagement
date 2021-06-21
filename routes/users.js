var express = require("express");
var router = express.Router();
const userDB = require("../helps/userdb");
/* GET users listing. */

function auth(req, res, next) {
  if (req.session.userStatus) {
    let userid = req.session.uid;
    userDB
      .getOneUser(userid)
      .then((u) => {
        if (u.status == false) {
          req.session.userStatus = false;
          res.redirect("/login");
        } else {
          if (req.session.userStatus == true) {
            req.session.name = u.username;
            next();
          } else {
            res.redirect("/login");
          }
        }
      })
      .catch((er) => {
        if (er == false) {
          res.redirect("/");
        } else {
          console.log(err);
        }
      });
  } else {
    res.redirect("/login");
  }
}

router.get("/", function (req, res, next) {
  if (req.session.userStatus) {
    res.redirect("/get-in");
  } else {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.render("user/home", { title: "home" });
  }
});

router.get("/login", (req, res) => {
  if (req.session.userStatus) {
    res.redirect("/get-in");
  } else {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.render("user/login", { title: "Login" });
  }
});

router.get("/get-in", auth, (req, res) => {
  const userDisplay = {
    name: req.session.name,
    image: req.session.image,
  };
  res.render("user/galaxy", { title: userDisplay.name, userDisplay });
});

router.get("/logout", (req, res) => {
  delete req.session.uid;
  delete req.session.image;
  delete req.session.name;
  delete req.session.userStatus;
  res.redirect("/");
});
// post methods
router.post("/sign-in", (req, res) => {
  const signupStatus = {
    status: false,
  };
  const user = req.body.email;
  const pass = req.body.password;
  userDB
    .userSignin(user, pass)
    .then((u) => {
      req.session.uid = u._id;
      req.session.userStatus = u.status;
      req.session.image = u.image;
      req.session.name = u.username;
      signupStatus.status = true;
      res.json(signupStatus);
    })
    .catch((e) => {
      signupStatus.status = false;
      signupStatus.msg = e;
      res.json(signupStatus);
    });
});

router.post("/sign-up", (req, res) => {
  const signupStatus = {
    status: false,
  };
  userDB
    .userSignup(req.body)
    .then((data) => {
      req.session.uid = data._id;
      req.session.userStatus = data.status;
      req.session.image = data.image;
      req.session.name = data.username;
      signupStatus.status = true;
      res.json(signupStatus);
    })
    .catch((e) => {
      signupStatus.status = false;
      res.json(signupStatus);
    });
});

module.exports = router;
