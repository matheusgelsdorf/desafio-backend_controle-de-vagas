const accessLevel = require('./auth-access-level')


module.exports = app => {
   //-----------------------------------------//
   app.route('/signin/admin') //[--] Tested
      .post(app.api.auth.signinAdmin)

   app.route('/signin/candidate')
      .post(app.api.auth.signinCandidate) //[--] Tested

   app.route('/validateToken')
      .post(app.api.auth.validateToken) //[--] Tested

   app.route('/signup/candidate')
      .post(app.api.candidates.save) //[--] Tested

   // --------------------------------------------------------------------- //  

   app.route('/candidate/getByCpf')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.candidates.getCandidateByCpf).candidate()) //[--] Tested

   app.route('/candidate/getByCpf/:cpf')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.candidates.getCandidateByCpf).admin()) // [--] Tested


   app.route('/candidate')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.candidates.get).admin())  //[--] Tested
      .put(accessLevel(app.api.candidates.save).candidate()) //[--] Tested 
   //.delete()

   app.route('/admin/getByCpf')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.administrators.getAdministratorByCpf).admin()) //[--] Tested


   app.route('/admin')
      .all(app.config.passport.authenticate())
      .post(accessLevel(app.api.administrators.save).admin()) // [--] Tested
      .get(accessLevel(app.api.administrators.get).admin())  // [--] Tested
      .put(accessLevel(app.api.administrators.save).admin()) //[--] Tested
   //.delete()

   app.route('/vacancy/getById/:id')
      .all(app.config.passport.authenticate())
      .get(app.api.job_vacancies.getJobVacancyById) //[--] Tested

   app.route('/vacancy')
      .all(app.config.passport.authenticate())
      .post(accessLevel(app.api.job_vacancies.save).admin())  // [--] Tested 
      .get(app.api.job_vacancies.get) // [--] Tested
      .put(accessLevel(app.api.job_vacancies.save).admin()) // [--] Tested
   //.delete()

// getAllCandidatesJobApplicationByID,getJobApplicationById, save

   app.route('/application/getAllById/:vacancy_id')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.job_applications.getAllCandidatesJobApplicationByID).candidate())  //[--] Tested 


   app.route('/application/getById/:id')
      .all(app.config.passport.authenticate())
      .get(app.api.job_applications.getJobApplicationById) //[--] Tested

   app.route('/application')
      .all(app.config.passport.authenticate())
      .post(accessLevel(app.api.job_applications.save).candidate()) //[--] Tested
      .put(accessLevel(app.api.job_applications.editApplicationStage).admin()) //[--] Tested

   app.route('/comment/getById/:id')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.comments.getCommentById).admin()) //[--] Tested


   app.route('/comment/application/getAllByID/:application_id')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.comments.getAllApplicationsCommentsById).admin())  //[--] Tested


   app.route('/comment')
      .all(app.config.passport.authenticate())
      .post(accessLevel(app.api.comments.save).admin()) //[--] Tested
      .put(accessLevel(app.api.comments.save).admin()) //[--] Tested
   //.delete()



   //---------------------------------------------------------------------

   /* [***] app.route('/admin')
   .post()
   .get()
   .put()
   .delete()*/
}
