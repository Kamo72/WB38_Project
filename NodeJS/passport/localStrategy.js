const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userModule = require("../modules/user.js");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username", //req.body.username
        passwordField: "password", //req.body.password
      },
      async function (username, password, done) {
        console.log("Local Strategy:", username, password);
        userModule.find(username, function (error, user) {
          if (error) {
            return done(error);
          }
          if (!user) {
            return done(null, false, { message: "존재하지 않는 ID" });
          }

          userModule.verifyPassword(password, user, function (err, isMatch) {
            if (err) {
              console.log("Error : " + err);
              return done(err);
            }
            if (!isMatch) {
              console.log("틀린 PW");
              return done(null, false, { message: "틀린 PW" });
            }

            return done(null, user);
          });
        });
      }
    )
  );
};
