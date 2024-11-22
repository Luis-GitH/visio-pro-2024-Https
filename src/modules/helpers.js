const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = function (password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt, null, (err, password) => {
    if (err) {
      console.log(new Date().toISOString(),"Error hasheando:", err);
    } else {
      console.log(new Date().toISOString(),"Y hasheada es:" + password);
    }
  })
};

// checking if password is valid
helpers.matchPassword = function (password, savedPassword) {
  // console.log(new Date().toISOString(),'args:',password, savedPassword)
  try {
    return bcrypt.compareSync(password, savedPassword);
  } catch (e) {
    console.log(new Date().toISOString(),'Error en matchPassword: ', e)
    return false;
  }
}

module.exports = helpers;
