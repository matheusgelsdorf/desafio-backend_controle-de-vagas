const accessLevel = require('./auth-access-level')


module.exports = app => {
   //-----------------------------------------//
   app.route('/signin/admin') //[--] Testado
      .post(app.api.auth.signinAdmin)

   app.route('/signin/candidate')
      .post(app.api.auth.signinCandidate)

   app.route('/validateToken')
      .post(app.api.auth.validateToken)

   app.route('/signup/candidate')
      .post(app.api.candidates.save) 

   // --------------------------------------------------------------------- //  
   
   app.route('/candidate/getByCpf')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.candidates.getCandidateByCpf).candidate()) //[--] Testado

   app.route('/candidate/getByCpf/:cpf')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.candidates.getCandidateByCpf).admin())


   app.route('/candidate')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.candidates.get).admin())  //[--] Testado
      .put(accessLevel(app.api.candidates.save).candidate()) //[--] Testado 
   //.delete()

   app.route('/admin/getByCpf')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.administrators.getAdministratorByCpf).admin())


   app.route('/admin')
      .all(app.config.passport.authenticate())
      .post(accessLevel(app.api.administrators.save).admin()) // [--] Testada
      .get(accessLevel(app.api.administrators.get).admin())  // [--] Testada
      .put(accessLevel(app.api.administrators.save).admin()) //[--] Testada
   //.delete()
      
   app.route('/vacancy/getJobVacancyById/:id')
      .all(app.config.passport.authenticate())
      .get(app.api.job_vacancies.getJobVacancyById)

   app.route('/vacancy')
      .all(app.config.passport.authenticate())
      .post(accessLevel(app.api.job_vacancies.save).admin())  
      .get(app.api.job_vacancies.get) // [--] Testado
      .put(accessLevel(app.api.job_vacancies.save).admin())
//.delete()

   app.route('/comment/getById/:id')
   .all(app.config.passport.authenticate())
   .get(accessLevel(app.api.candidates.getCommentById).admin())  


   app.route('/comment/application/getByID/:id')
   .all(app.config.passport.authenticate())
   .get(accessLevel(app.api.candidates.getAllApplicationsCommentsById).admin()) 


   app.route('/comment')
      .all(app.config.passport.authenticate())
      .post(accessLevel(app.api.comments.save).admin()) 
      .put(accessLevel(app.api.comments.save).admin()) 
   //.delete()



   //---------------------------------------------------------------------

   /* [***] app.route('/admin')
   .post()
   .get()
   .put()
   .delete()*/
}
