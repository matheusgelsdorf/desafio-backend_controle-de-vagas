const accessLevel = require('./auth-access-level')


module.exports = app => {
   //------------------- NO AUTHENTICATION ----------------------//
   app.route('/signin/admin')
      .post(app.api.auth.signinAdmin)

   app.route('/signin/candidate')
      .post(app.api.auth.signinCandidate)

   app.route('/validateToken')
      .post(app.api.auth.validateToken)

   app.route('/signup/candidate')
      .post(app.api.candidates.save)

   // --------------------------------------------------------------------- //  
   //------------------- CANDIDATE ----------------------//
   app.route('/candidate/getByCpf')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.candidates.getCandidateByCpf).candidate())

   app.route('/candidate/getByCpf/:cpf')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.candidates.getCandidateByCpf).admin())


   app.route('/candidate')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.candidates.get).admin())
      .put(accessLevel(app.api.candidates.save).candidate())
      .delete(accessLevel(app.api.candidates.remove).candidate())
   // --------------------------------------------------------------------- // 
   //------------------- ADMIN ----------------------//

   app.route('/admin/getByCpf')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.administrators.getAdministratorByCpf).admin())


   app.route('/admin')
      .all(app.config.passport.authenticate())
      .post(accessLevel(app.api.administrators.save).admin())
      .get(accessLevel(app.api.administrators.get).admin())
      .put(accessLevel(app.api.administrators.save).admin())
      .delete(accessLevel(app.api.administrators.remove).admin())


   // --------------------------------------------------------------------- // 
   //------------------- VACANCY ----------------------//


   app.route('/vacancy/getById/:id')
      .all(app.config.passport.authenticate())
      .get(app.api.job_vacancies.getJobVacancyById)

   app.route('/vacancy')
      .all(app.config.passport.authenticate())
      .post(accessLevel(app.api.job_vacancies.save).admin())
      .get(app.api.job_vacancies.get)
      .put(accessLevel(app.api.job_vacancies.save).admin())
      .delete(accessLevel(app.api.job_vacancies.remove).admin())

   app.route('/vacancy/getAllVacancyCandidates/:vacancy_id')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.job_vacancies.getAllVacancyCandidates).admin())

   app.route('/vacancy/getAllAdminVacancies')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.job_vacancies.getAllAdminVacancies).admin())



   // --------------------------------------------------------------------- // 
   //------------------- APPLICATION ----------------------//

   app.route('/application/getAllById')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.job_applications.getAllCandidatesJobApplicationByID).candidate())


   app.route('/application/getById/:id')
      .all(app.config.passport.authenticate())
      .get(app.api.job_applications.getJobApplicationById)



   app.route('/application')
      .all(app.config.passport.authenticate())
      .post(accessLevel(app.api.job_applications.save).candidate())
      .put(accessLevel(app.api.job_applications.editApplicationStage).admin())
      .delete(accessLevel(app.api.job_applications.remove).candidate())

   // --------------------------------------------------------------------- // 
   //------------------- COMMENT ----------------------//

   app.route('/comment/getById/:id')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.comments.getCommentById).admin())


   app.route('/comment/application/getAllByID/:application_id')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.comments.getAllApplicationsCommentsById).admin())


   app.route('/comment')
      .all(app.config.passport.authenticate())
      .post(accessLevel(app.api.comments.save).admin())
      .put(accessLevel(app.api.comments.save).admin())
      .delete(accessLevel(app.api.comments.remove).admin())



}
   //---------------------------------------------------------------------//
