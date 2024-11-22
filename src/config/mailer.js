module.exports.jConfigNoReplay = {
  // host: process.env.PRIVATE_MAIL_HOST,
  // port: process.env.PRIVATE_MAIL_PORT,
  // secureConnection: true,
  service: 'yahoo',
  auth: {
    user: process.env.PRIVATE_noMAIL_USER,
    pass: process.env.PRIVATE_noMAIL_PASS,
  }
};


module.exports.jConfigGestion= {
  // host: process.env.PRIVATE_MAIL_HOST,
  // port: process.env.PRIVATE_MAIL_PORT,
  // secureConnection: true,
  service: 'yahoo',
  auth: {
    user: process.env.PRIVATE_GESTION_MAIL_USER,
    pass: process.env.PRIVATE_GESTION_MAIL_PASS,
  }
};
 