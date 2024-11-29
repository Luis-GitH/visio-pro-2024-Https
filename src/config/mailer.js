module.exports.jConfigNoReplay = {
  service: 'yahoo',
  auth: {
    user: process.env.PRIVATE_noMAIL_USER,
    pass: process.env.PRIVATE_noMAIL_PASS,
  }
};


module.exports.jConfigGestion= {
  service: 'yahoo',
  auth: {
    user: process.env.PRIVATE_GESTION_MAIL_USER,
    pass: process.env.PRIVATE_GESTION_MAIL_PASS,
  }
};
 