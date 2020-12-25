// Houses jwt strategy config
// @see - http://www.passportjs.org/packages/passport-jwt/

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("auth");
// const User = require("../models/Auth");
const passportSecret = process.env.JWTSECRET;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = passportSecret;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // get user
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }

          return done(null, false);
        })
        .catch((err) =>
          console.error("**** passport config: error fetching user by id *****")
        );
    })
  );
};
