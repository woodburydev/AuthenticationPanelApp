const User = require("./user");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) throw err;
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err;
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    })
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      // Lets define a user to get admin privileges!
      if (user.username == "nathanielwoodbury") {
        const userInformation = {
          username: user.username,
          admin: true,
        };
        cb(err, userInformation);
      } else {
        const userInformation = {
          username: user.username,
        };
        cb(err, userInformation);
      }
    });
  });
};
