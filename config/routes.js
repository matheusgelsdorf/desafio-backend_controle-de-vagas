const accessLevel = require('./auth-access-level')


module.exports = app => {

   app.route('/signin/admin')
      .post(app.api.auth.signinAdmin)

   app.route('/signin/candidate')
      .post(app.api.auth.signinCandidate)

   app.route('/validateToken')
      .post(app.api.auth.validateToken)

   app.route('/signup/candidate')
      .post(app.api.candidates.save) // Cadastra um candidato  

   // --------------------------------------------------------------------- //  
   app.route('/comment/getById/:id')
   .all(app.config.passport.authenticate())
   .get(accessLevel(app.api.candidates.getCommentById).admin())  // Retorna um unico comentario correspondete ao id




   app.route('/comment/application/getByID/:id')
   .all(app.config.passport.authenticate())
   .get(accessLevel(app.api.candidates.getAllApplicationsCommentsById).admin())  // Retorna todos os comentarios de um administrador feito a uma vaga de emprego.



   app.route('/comment')
      .all(app.config.passport.authenticate())
      .post(accessLevel(app.api.comments.save).admin()) // Cadastra um comentario  
      .put(accessLevel(app.api.comments.save).admin()) // Atualiza os dados de um comentario. So pode ser atualizado pelo proprio administrador que comentou pela primeira vez.
   //.delete()


   app.route('/candidate/getByCpf/:cpf')
      .all(app.config.passport.authenticate())
      .get(app.api.candidates.getCandidateByCpf)

   app.route('/candidate')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.candidates.get).admin())  // Retorna todos os candidatos cadastrados
      .put(accessLevel(app.api.candidates.save).candidate()) // Atualiza os dados de um candidato. So pode ser atualizado pelo proprio candidato.
   //.delete()


   app.route('/admin/getByCpf/:cpf')
      .all(app.config.passport.authenticate())
      .get(acessLevel(app.api.administrators.getAdministratorByCpf).admin())


   app.route('/admin')
      .all(app.config.passport.authenticate())
      .post(accessLevel(app.api.administrators.save).admin()) // Cadastra um administrador  
      .get(accessLevel(app.api.administrators.get).admin())  // Retorna todos os administradores cadastrados
      .put(accessLevel(app.api.administrators.save).admin()) // Atualiza os dados de um administrador. So pode ser atualizado pelo proprio administrador.
   //.delete()


   //---------------------------------------------------------------------

   /* [***] app.route('/admin')
   .post()
   .get()
   .put()
   .delete()*/
}
