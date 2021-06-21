const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const adminSchema = new mongoose.Schema({
  email: String,
  username: String,
  phone: Number,
  image: String,
  adminPosition: String,
  password: String,
});

const AdminInfo = mongoose.model("admininfo", adminSchema);

module.exports = {
  adminRegister: (adminData) => {
    return new Promise((resolve, reject) => {
      AdminInfo.findOne({ username: adminData.username }, (err, data) => {
        if (!err) {
          if (data) {
            reject("username already exist");
          } else {
            bcrypt.hash(adminData.password, saltRounds, function (err, hash) {
              const admin = new AdminInfo({
                email: adminData.email,
                username: adminData.username,
                phone: adminData.phone,
                image: adminData.image,
                adminPosition: adminData.adminStatus,
                password: hash,
              });
              admin.save((err, room) => {
                if (!err) {
                  resolve(room);
                }
              });
            });
          }
        } else {
          console.log(err);
        }
      });
    });
  },
  adminLogin: (user, pass) => {
    return new Promise((resolve, reject) => {
      AdminInfo.findOne({ username: user }, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          if (!data) {
            reject("No user Found");
          } else {
            bcrypt.compare(pass, data.password, function (err, result) {
              if (result) {
                resolve(data);
              } else {
                reject("Password Incorrect");
              }
            });
          }
        }
      });
    });
  },
  getAdminData: (admin) => {
    return new Promise((resolve, reject) => {
      AdminInfo.findOne({ _id: admin }, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  },
  changePass: (userID, user) => {
    return new Promise((resolve, reject) => {
      AdminInfo.findOne({ _id: userID }, function (err, data) {
        if (!err) {
          bcrypt.compare(user.old_pass, data.password, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              if (result) {
                bcrypt.hash(user.new_pass, saltRounds, function (err, newHash) {
                  if (err) {
                    console.log(err);
                  } else {
                    AdminInfo.findOneAndUpdate(
                      { _id: userID },
                      { $set: { password: newHash } },
                      function (err, result) {
                        if (!err) {
                          resolve("Password successfully changed");
                        }
                      }
                    );
                  }
                });
              } else {
                reject("Doesn't Match User Password");
              }
            }
          });
        } else {
          console.log(err);
        }
      });
    });
  },
};
