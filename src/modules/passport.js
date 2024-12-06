// config/passport.js
// version mariadb con userModel
const helpers = require('./helpers'),
  LocalStrategy = require('passport-local').Strategy,
  usersModel = require("../app/models/user"),
  f = require('./funcionesLog');

// expose this function to our app using module.exports
module.exports = function (passport) {
  // =========================================================================
  // passport session setup 
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(async function (id, done) {
    [err, rows] = await usersModel.findById(id);
    done(err, rows[0])
  });

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with codigo
    usernameField: 'codigo',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
    async function (req, codigo, password, done) { // callback with codigo and password from our form
      [err, rows] = await usersModel.findByCodigo(codigo);
      if (err) {
        return done(err);
      }
      if (!rows.length) {
        f.loger(`Centro erroneo - Centro: ${codigo} pwd: ${password}`,'login');
        return done(null, false, req.flash('loginMessage', 'Centro no encontrado.')); // req.flash is the way to set flashdata using connect-flash
      }
      // if the user is found but the password is wrong
      if (!(helpers.matchPassword(password, rows[0].password))) {
        f.loger(`Clave erronea -- Centro: ${codigo} pwd: ${password}`,'login')
        return done(null, false, req.flash('loginMessage', 'Oops! Clave equivocada.')); // create the loginMessage and save it to session as flashdata
      }
      
      // retornamos 
      return done(null, rows[0]);
    }))
}


