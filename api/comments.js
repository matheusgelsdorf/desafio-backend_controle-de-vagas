module.exports = app => {

    const save = (req, res) => {
        const comment = { ...req.body.comment }
        const comment_id = req.body.comment_id
        const admin = { ...req.user }

        if (comment.registered_at) delete comment['posted_at']

        if (comment.deleted_at) delete comment['deleted_at']
        if (comment.edited_at) delete comment['edited_at']

        /* Validações */

        try {
            if (req.method === "PUT") {
                if (comment.content) app.api.validation.existsOrError(comment.content, "Insira um comentário.")

                app.api.validation.existsOrError(comment_id, "Escolha um comentario para editar.")

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
            if (admin.id == !comment_id) return res.status(403).send("Usuário não tem permissão para editar esse comentário.")
            const comment_edited = { edited_at: new Date(), content: comment.content }
            app.db('comments')
                .where({ id: comment_id })
                .whereNull('deleted_at')
                .first()
                .update(comment_edited)
                .then(() => {
                    res.status(204).send()
                })
                .catch(err => res.status(500).send("Não foi possível editar comentário."))
        }
        else if (req.method === "POST") {

            if (comment.id) delete comment['id']
            comment.posted_at = new Date()
            app.db('comments').insert(comment)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send("Nao foi possível cadastrar comentário."))
        }
    }

    const getCommentById = (req, res) => {

        const id = req.params.id

        app.db('comments')
            .where({ id })
            .whereNull('deleted_at')
            .first()
            .then(comment_from_db => {
                delete comment_from_db['deleted_at']
                return res.json(comment_from_db)
            })
            .catch(err => res.status(500).send("Nao foi possivel encontrar comentário. Verifique se os dados fornecidos estâo corretos."))

    }

    const getAllApplicationsCommentsById = (req, res) => {

       let admin={...req.user}
       const application_id={...req.params.application_id}

        app.db('comments')
            .select('id', 'posted_at', 'edited_at','content')
            .where({ id:admin.id, application_id})
            .whereNull('deleted_at')
            .then(comment_from_db_set => {
                return res.json(comment_from_db_set)
            })
            .catch(err => res.status(500).send("Erro ao buscar usuário. Verifique se os dados estão corretos.")) //[***] Arrumar esse erro inesperado

    }

 

    /* const remove = (req, res) => {
         const comment = { ...req.body }
         app.db('comments')
             .where({ id: comment.id })
             .whereNull('deleted_at')
             .first()
             .update({ deleted_at: new Date() })
             .then(() => res.status(204).send())
             .catch((e) => {
                 res.status(501).send()
             }
             )
     }*/

    return { getAllApplicationsCommentsById, getCommentById, save}
}

