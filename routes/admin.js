var express = require("express");
var router = express.Router();
var adminDB = require("../helps/admindb");

var userDB = require("../helps/userdb");
function auth(req, res, next) {
  if (req.session.admin) {
    if (req.session.admin.status) {
      next();
    } else {
      res.redirect("/admin");
    }
  } else {
    res.redirect("/admin");
  }
}

/* GET home page. */
router.get("/", function (req, res) {
  if (req.session.admin) {
    if (req.session.admin.status) {
      res.redirect("/admin/dashboard");
    } else {
      res.render("admin/adminLogin", { title: "Admin Login" });
    }
  } else {
    res.render("admin/adminLogin", { title: "Admin Login" });
  }
});

// admin dashboard
router.get("/dashboard", auth, (req, res) => {
  let position = req.session.admin.power;
  let user = req.session.admin.username;
  let image = req.session.admin.image;
  userDB.getAllusers().then((data) => {
    if (position == "guest") {
      res.render("admin/dashboard", {
        position: false,
        user,
        image,
        title: "Admin Panel",
        data,
      });
    } else {
      res.render("admin/dashboard", {
        position: true,
        user,
        image,
        title: "Admin Panel",
        data,
      });
    }
  });
});

// admin profile
router.get("/profile", auth, (req, res) => {
  adminDB
    .getAdminData(req.session.admin.id)
    .then((data) => {
      res.render("admin/adminprofile", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// admin user profile
router.get("/user/profile/:id", auth, (req, res) => {
  let userId = req.params.id;

  userDB
    .getOneUser(userId)
    .then((data) => {
      let { image, username, phone, email } = data;
      res.header(
        "Cache-Control",
        "private, no-cache, no-store, must-revalidate"
      );
      res.render("admin/userprofile", {
        title: data.username,
        image,
        username,
        phone,
        email,
      });
    })
    .then((err) => {
      if (err == false) {
        res.redirect("/admin/dashboard");
      } else {
        console.log(err);
      }
    });
});

// admin user edit
router.get("/user-edit/:topic", auth, (req, res) => {
  let uid = req.params.topic;
  userDB
    .getOneUser(uid)
    .then((data) => {
      let { image, username, phone, email, password, _id } = data;
      res.header(
        "Cache-Control",
        "private, no-cache, no-store, must-revalidate"
      );
      res.render("admin/useredit", {
        title: data.username,
        _id,
        image,
        username,
        phone,
        email,
        password,
      });
    })
    .catch((err) => {
      if (err == false) {
        res.redirect("/admin/dashboard");
      } else {
        console.log(err);
      }
    });
});

// admin active and deactive user
router.get("/userstatus/:topic", auth, (req, res) => {
  let changed = { status: false };
  let id = req.params.topic;
  userDB.changeStatus(id).then((st) => {
    changed.status = st;
    res.json(changed);
  });
});

router.get("/add-admin", auth, (req, res) => {
  if (req.session.admin) {
    if (req.session.admin.power == "super") {
      res.header(
        "Cache-Control",
        "private, no-cache, no-store, must-revalidate"
      );
      res.render("admin/addadmin");
    } else {
      res.redirect("/admin/dashboard");
    }
  }
});

router.get("/change-pass", auth, (req, res) => {
  adminDB
    .getAdminData(req.session.admin.id)
    .then((data) => {
      res.render("admin/passwordreset", data);
    })
    .catch((err) => {
      console.log(err);
    });
});
// admin logout

router.get("/logout", auth, (req, res) => {
  delete req.session.admin;
  res.redirect("/admin");
});

// admin post methods
router.post("/", (req, res) => {
  let username = req.body.admin_username;
  let pass = req.body.admin_password;

  const adminAttempt = {
    status: false,
  };
  adminDB
    .adminLogin(username, pass)
    .then((admin) => {
      req.session.admin = {
        id: admin._id,
        status: true,
        power: admin.adminPosition,
        username: admin.username,
        image: admin.image,
      };
      adminAttempt.status = true;
      res.json(adminAttempt);
    })
    .catch((e) => {
      adminAttempt.status = false;
      adminAttempt.errmsg = e;
      res.json(adminAttempt);
    });
});

router.post("/add-admin", auth, (req, res) => {
  const adminReg = { status: false };
  adminDB
    .adminRegister(req.body)
    .then((data) => {
      adminReg.status = true;
      res.json(adminReg);
    })
    .catch((e) => {
      adminReg.status = false;
      res.json(adminReg);
    });
});

// pass word change
router.post("/change-pass", auth, (req, res) => {
  console.log(req.body);
  const changeStatus = { status: false };
  let userId = req.session.admin.id;
  adminDB
    .changePass(userId, req.body)
    .then((msg) => {
      changeStatus.status = true;
      changeStatus.msg = msg;
      res.json(changeStatus);
    })
    .catch((err) => {
      changeStatus.status = false;
      changeStatus.msg = err;
      res.json(changeStatus);
    });
});

// admin
router.post("/add-user", auth, (req, res) => {
  const addedUser = { status: false };
  userDB
    .userSignup(req.body)
    .then((data) => {
      addedUser.status = true;
      addUser.msg = "User added successfuly";
      res.json(addedUser);
    })
    .catch((e) => {
      addedUser.status = true;
      addedUser.msg = e;
      res.json(addedUser);
    });
});

// updating user data
router.post("/user-edit/:topic", auth, (req, res) => {
  let updateStatus = { status: false };
  let userid = req.params.topic;
  userDB
    .updateUser(userid, req.body)
    .then((e) => {
      updateStatus.status = true;
      updateStatus.msg = e;
      res.json(updateStatus);
    })
    .catch((err) => {
      updateStatus.status = false;
      updateStatus.msg = e;
      res.json(updateStatus);
    });
});

// admin delte user
router.get("/delete-user/:topic", auth, (req, res) => {
  let deletedStatus = { status: false };
  userDB
    .deleteUser(req.params.topic)
    .then((e) => {
      deletedStatus.status = true;
      res.json(deletedStatus);
    })
    .catch((err) => {
      deletedStatus.status = true;
      deletedStatus.msg = err;
      res.json(deletedStatus);
    });
});

// admin search user
router.post("/search", auth, (req, res) => {
  let position = req.session.admin.power;
  let username = req.session.admin.username;
  let image = req.session.admin.image;
  console.log(req.body.searchValue);
  userDB
    .getSearch(req.body.searchValue)
    .then((data) => {
      if (position == "guest") {
        res.header(
          "Cache-Control",
          "private, no-cache, no-store, must-revalidate"
        );
        res.render("admin/dashboard", {
          position: false,
          user: username,
          image,
          title: "Admin Panel",
          data,
        });
      } else {
        res.render("admin/dashboard", {
          position: true,
          user: username,
          image,
          title: "Admin Panel",
          data,
        });
      }
    })
    .catch((data) => {
      if (position == "guest") {
        res.render("admin/dashboard", {
          position: false,
          user: username,
          image,
          title: "Admin Panel",
          data: null,
          err: "No user found!",
        });
      } else {
        res.render("admin/dashboard", {
          position: true,
          user: username,
          image,
          title: "Admin Panel",
          data: null,
          err: "No user found!",
        });
      }
    });
});

module.exports = router;
