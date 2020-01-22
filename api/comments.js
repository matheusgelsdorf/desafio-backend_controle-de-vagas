module.exports = app => {

    const save = async (req, res) => {
        const comment = { ...req.body }
        const admin = { ...req.user }

        if (comment.registered_at) delete comment['posted_at']

      // --==--  if (comment.deleted_at) delete comment['deleted_at']
        if (comment.edited_at) delete comment['edited_at']

        /* Validações */

        try {
            if (req.method === "PUT") {
                if (comment.content) app.api.validation.existsOrError(comment.content, "Insira um comentário.")

                app.api.validation.existsOrError(comment.id, "Escolha um comentario para editar.")

            }
            else if (req.method === "POST") {

                app.api.validation.existsOrError(comment.application_id, "Escolha uma candidatura para comentar.")

                app.api.validation.existsOrError(comment.content, "Insira um comentário.")

            }
        }
        catch (e) {
            return res.status(400).send(e)
        }
        /* ---------------- */



        if (req.method === "PUT") {
            const comment_edited = {
                id: comment.id,
                edited_at: new Date(),
                content: comment.content
            }
            try {
               const comment_from_db= await app.db('comments')
                    .where({ id: comment_edited.id })
          // --==--          .whereNull('deleted_at')
                    .first()
                    
                    if (!comment_from_db || comment_from_db === {} || (admin.id !== comment_from_db.admin_id)) return res.status(403).send("Usuário não tem permissão para editar esse comentário.")
                    
                    await app.db('comments')
                    .where({ id: comment_edited.id })
          // --==--          .whereNull('deleted_at')
                    .first()
                    .update(comment_edited)
                    .then(() => {
                        return res.status(204).send()
                    })
            }
            catch (e) {
                return res.status(500).send("Não foi possível editar comentário.")
            }
        }
        else if (req.method === "POST") {

            if (comment.id) delete comment['id']
            const comment_to_save = {
                posted_at: new Date(),
                edited_at: null,
        // --==--        deleted_at: null,
                admin_id: admin.id,
                application_id: comment.application_id,
                content: comment.content
            }

            app.db('comments').insert(comment_to_save)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send("Nao foi possível cadastrar comentário."))
        }
    }

    const getCommentById = (req, res) => {

        const id = req.params.id

        app.db('comments')
            .where({ id })
     // --==--       .whereNull('deleted_at')
            .first()
            .then(comment_from_db => {
     // --==--           delete comment_from_db['deleted_at']
                return res.json(comment_from_db)
            })
            .catch(err => res.status(500).send("Nao foi possivel encontrar comentário. Verifique se os dados fornecidos estâo corretos."))

    }

    const getAllApplicationsCommentsById = (req, res) => {

        const application_id = req.params.application_id

        app.db('comments')
            .select('id', 'posted_at', 'edited_at', 'content', 'application_id')
            .where({ application_id })
    // --==--        .whereNull('deleted_at')
            .then(comment_from_db_set => {
                return res.json(comment_from_db_set)
            })
            .catch(err => res.status(500).send("Erro ao buscar usuário."))

    }



    /* const remove = (req, res) => {
         const comment = { ...req.body }
         app.db('comments')
             .where({ id: comment.id })
             .whereNull('deleted_at')
             .first()
             .update({ : new Date() })
             .then(() => res.status(204).send())
             .catch((e) => {
                 res.status(501).send()
             }
             )
     }*/

     const remove = async(req, res) => {


        const admin_token = {...req.user}
        const comment= {...req.body}

        app.db('comments')
            .where({id: comment.id, admin_id:admin_token.id})
            .first()
            .del()
            .then(_ => res.status(204).send())
            .catch(e => res.status(500).send('Nao foi possivel remover comentario.'))

    }
    return { getAllApplicationsCommentsById, getCommentById, save, remove }
}

