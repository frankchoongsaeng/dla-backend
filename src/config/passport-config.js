/**
 * @author Frank Choongsaeng
 * 
 * @description configures passport for authentication
 * contains local authentication, google authentication,
 * facebook authentication, and twitter authentication
 */

// DEPENDENCIES
const passport = require("passport");
const models = require("../constants/models");
const { getOne } = require("../db");
const LocalStrategy = require("passport-local");


/**
 * 
 * VERIFICATION CALLBACKS
 * Verification callbacks are called when an authentication means is triggered.
 * These verification callback are defined for all the different callback 
 */

// verify callback for local signin process
const verifyLocalUser = (email, password, done) => {

  getOne({
    query: { email },
    from: models.USER,
  }, (err, user) => {
    // return an err if an error occurred
    if (err) { return done(err); }

    // could not find the user
    if (!user) {
      console.trace("incorrect username");
      return done(null, false, { message: "Incorrect username." });
    }

    // compare users password
    user.validPassword(password, (err, isMatch) => {
      console.log({ err, isMatch })
      if (!isMatch) return done(null, false, { message: "Incorrect password" })

      return done(null, user);
    })
  });
}

// strategy for signin or singup with email and password
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, verifyLocalUser));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  getOne(
    {
      query: { _id: id },
      from: models.USER_MODEL
    },
    (err, user) => {
      done(err, user);
    }
  );
});
