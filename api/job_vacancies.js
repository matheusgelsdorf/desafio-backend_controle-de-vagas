

module.exports = app => {

    const save = async (req, res) => {
        let job_vacancy = { ...req.body}
        const admin_token = { ...req.user }


        if (job_vacancy.created_at) delete job_vacancy['created_at']

      // --==--  if (job_vacancy.deleted_at) delete job_vacancy['deleted_at']

        /* Validações */

        try {
            if (req.method === "PUT") {

                app.api.validation.existsOrError(job_vacancy, "Insira os dados que deseja modificar na vaga de emprego.")
                //titulo
                if (job_vacancy.title) app.api.validation.existsOrError(job_vacancy.title, "Insira um título da vaga.")
                //descrição
                if (job_vacancy.description) app.api.validation.existsOrError(job_vacancy.description, "Insira a descrição da vaga.")
                //etapas de recrutamento
                if (job_vacancy.recruitment_stages) app.api.validation.existsOrError(job_vacancy.recruitment_stages, "Insira o numero de etapas de recrutamento.") //[***]
                // vagas abertas
                if (job_vacancy.open_vacancies) app.api.validation.existsOrError(job_vacancy.open_vacancies, "Insira o numero de vagas abertas para o cargo.") //[***]

            }
            else if (req.method === "POST") {
                app.api.validation.existsOrError(job_vacancy.title, "Insira um título da vaga.")
                app.api.validation.existsOrError(job_vacancy.description, "Insira a descrição da vaga.")
                app.api.validation.existsOrError(job_vacancy.recruitment_stages, "Insira o numero de etapas de recrutamento.") //[***]
                app.api.validation.existsOrError(job_vacancy.open_vacancies, "Insira o numero de vagas abertas para o cargo.") //[***]

            }
        }
        catch (e) {
            return res.status(400).send(e)
        }
     


        if (req.method === "PUT") {

            try {
                await app.db('job_vacancies')
                    .select(["admin_id"])
                    .where({ id: job_vacancy.id })
           // --==--         .whereNull('deleted_at')
                    .first()
                    .then(vacancy_from_db => {
                        job_vacancy.admin_id = vacancy_from_db.admin_id
                    })
            } 
            catch (e) {
                return res.status(404).send("Vaga nao encontrada.")
            }

            if (job_vacancy.admin_id !== admin_token.id) return res.status(401).send("Você não tem permissão para alterar a vaga. Você so pode alterar vagas de sua autoria.")

            app.db('job_vacancies')
                .where({ id: job_vacancy.id, admin_id: admin_token.id })
        // --==--        .whereNull('deleted_at')
                .first()
                .update(job_vacancy)
                .then(() => {
                    res.status(204).send()
                })
                .catch(err => res.status(500).send("Nao foi possível atualizar vaga."))
        }
        else if (req.method === "POST") {

            if (job_vacancy.id) delete job_vacancy['id']
            job_vacancy.created_at = new Date()
            job_vacancy.admin_id = admin_token.id
            app.db('job_vacancies').insert(job_vacancy)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send("Nao foi possível cadastrar vaga."))
        }
    }

    const getJobVacancyById = (req, res) => {

        const id = req.params.id

        app.db('job_vacancies')
            .where({ id })
    // --==--        .whereNull('deleted_at')
            .first()
            .then(job_vacancy_from_db => {
                let job_vacancy = {
                    title: job_vacancy_from_db.title,
                    description: job_vacancy_from_db.description,
                    recruitment_stages: job_vacancy_from_db.recruitment_stages,
                    open_vacancies: job_vacancy_from_db.open_vacancies,
                    id: job_vacancy_from_db.id
                }
                return res.json(job_vacancy)
            })
            .catch(err => res.status(500).send())

    }

    const get = (req, res) => {
        app.db('job_vacancies')
            .select('id', 'title', 'description', 'recruitment_stages', 'open_vacancies', 'admin_id', 'created_at')
    // --==--        .whereNull('deleted_at')
            .then(job_vacancies => res.json(job_vacancies))
            .catch(() => res.status(502).send())
    }

    /* const remove = (req, res) => {
         const job_vacancy = { ...req.body }
         app.db('job_vacancies')
             .where({ id: job_vacancy.id })
             .whereNull('deleted_at')
             .first()
             .update({ deleted_at: new Date() })
             .then(() => res.status(204).send())
             .catch((e) => {
                 res.status(501).send()
             }
             )
     }*/
     const remove = async(req, res) => {


        const administrator_token = {...req.user}
        const vacancy= {...req.body}
        app.db('job_vacancies')
            .where({id: vacancy.id, admin_id:administrator_token.id})
            .first()
            .del()
            .then(_ => res.status(204).send())
            .catch(e => res.status(500).send('Nao foi possivel remover vaga.'))

    }

    return { getJobVacancyById, save, get, remove}
}

