const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const db = require('../models')
const User = db.user

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
  // secretOrKey: "MySuperSecretKey",
};

module.exports = async passport => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      console.log(process.env.JWT_SECRET)
      let user = await User.findOne({ where: { id: jwt_payload.id } })
      if (user) {
        return done(null, user);
      }

      return done(null, false);
    })
  );
};