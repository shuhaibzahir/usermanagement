const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: Number,
  image: String,
  password: String,
  status: Boolean,
});

const Userinfo = mongoose.model("userinfo", userSchema);

module.exports = {
  userSignup: (userDetails) => {
    return new Promise((resolve, reject) => {
      Userinfo.findOne({ email: userDetails.email }, (err, user) => {
        if (err) {
          console.log(err);
        } else {
          if (!user) {
            bcrypt.hash(userDetails.password, saltRounds, function (err, hash) {
              const userRegister = new Userinfo({
                username: userDetails.username,
                email: userDetails.email,
                phone: userDetails.phone,
                image: userDetails.image,
                password: hash,
                status: true,
              });
              userRegister.save((err, room) => {
                if (!err) {
                  resolve(room);
                } else {
                  console.log(err);
                }
              });
            });
          } else {
            reject("User already exist");
          }
        }
      });
    });
  },
  userSignin: (user, pass) => {
    return new Promise((resolve, reject) => {
      Userinfo.findOne({ email: user }, (err, data) => {
        if (!err) {
          if (!data) {
            reject("User not found");
          } else {
            bcrypt.compare(pass, data.password, function (err, result) {
              if (result) {
                if (data.status == true) {
                  resolve(data);
                } else {
                  reject("Your Account Deactivated");
                }
              } else {
                reject("Password Incorrect");
              }
            });
          }
        } else {
          console.log(err);
        }
      });
    });
  },
  getAllusers: () => {
    return new Promise((resolve, reject) => {
      Userinfo.find({}, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          console.log(err);
        }
      }).lean();
    });
  },
  changeStatus: (id) => {
    return new Promise((resolve, reject) => {
      Userinfo.findOne({ _id: id }, function (err, data) {
        if (!err) {
          if (data.status == true) {
            Userinfo.findOneAndUpdate(
              { _id: id },
              { $set: { status: false } },
              (err, result) => {
                resolve(false);
              }
            );
          } else {
            Userinfo.findOneAndUpdate(
              { _id: id },
              { $set: { status: true } },
              (err, item) => {
                resolve(true);
              }
            );
          }
        } else {
          console.log(err);
        }
      });
    });
  },

  getOneUser: (id) => {
    return new Promise((resolve, reject) => {
      Userinfo.findOne({ _id: id }, (err, data) => {
        if (!err) {
          if (data) {
            resolve(data);
          } else {
            reject(false);
          }
        } else {
          reject(err);
        }
      });
    });
  },
  updateUser: (user, details) => {
    return new Promise((resolve, reject) => {
      Userinfo.findOneAndUpdate(
        { _id: user },
        {
          $set: {
            username: details.username,
            phone: details.phone,
            image: details.image,
          },
        },
        (err, data) => {
          if (!err) {
            resolve(" Successfully Updated");
          } else {
            reject("error try again");
          }
        }
      );
    });
  },
  deleteUser: (id) => {
    return new Promise((resolve, reject) => {
      Userinfo.findOneAndDelete({ _id: id }, function (err, data) {
        if (!err) {
          resolve("successfuly delted");
        } else {
          reject("some error");
        }
      });
    });
  },
  getSearch: (user) => {
    console.log(user);
    return new Promise((resolve, reject) => {
      Userinfo.find(
        { username: { $regex: user, $options: "i" } },
        function (err, data) {
          if (!err) {
            console.log(data);
            if (data.length != 0) {
              resolve(data);
            } else {
              reject("No User Find !");
            }
          } else {
            reject("some error");
          }
        }
      ).lean();
    });
  },
};
