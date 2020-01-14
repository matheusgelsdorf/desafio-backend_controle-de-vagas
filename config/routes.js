const accessLevel = require('./auth-access-level')


module.exports = app => {

   app.route('/signin')
      .post(app.api.auth.signin)
   app.route('/validateToken')
      .post(app.api.auth.validateToken)
   app.route('/signinDevice')
      .post(app.api.auth.signinDevice)

   // --------------------------------------------------------------------- //   


   app.route('/device') //*
      .all(app.config.passport.authenticate())
      .post(accessLevel(app.api.devices.save).admin())           //C
      .get(accessLevel(app.api.devices.get).admin())              //R
      .put(accessLevel(app.api.devices.save).admin())            //U
      .delete(accessLevel(app.api.devices.remove).admin())       //D


   //---------------------------------------------------------------------

}
