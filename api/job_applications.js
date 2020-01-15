

module.exports = app => {

    const save = (req, res) => {
        const job_application = {...req.body}
        const candidate = {...req.user }

        if (job_application.applied_at) delete job_application['applied_at']

        if (job_application.deleted_at) delete job_application['deleted_at']

        /* Validações */

        try {
            if (req.method === "PUT") {
                //titulo
                if (job_application.title) app.api.validation.existsOrError(job_application.title, "Insira um título da vaga.")
                //descrição
                if (job_application.description) app.api.validation.existsOrError(job_application.description, "Insira a descrição da vaga.")
                //etapas de recrutamento
                if (job_application.recruitment_stages) app.api.validation.existsOrError(job_application.recruitment_stages, "Insira o numero de etapas de recrutamento.")
                // vagas abertas
                if (job_application.open_vacancies) app.api.validation.existsOrError(job_application.open_vacancies, "Insira o numero de vagas abertas para o cargo.")

            }
            else if (req.method === "POST") {
                app.api.validation.existsOrError(job_application.title, "Insira um título da vaga.")
                app.api.validation.existsOrError(job_application.description, "Insira a descrição da vaga.")
                app.api.validation.existsOrError(job_application.recruitment_stages, "Insira o numero de etapas de recrutamento.")
                app.api.validation.existsOrError(job_application.open_vacancies, "Insira o numero de vagas abertas para o cargo.")

            }
        }
        catch (e) {
            return res.status(400).send(e)
        }
        /* ---------------- */



        if (req.method === "PUT") {
            app.db('job_vacancies')
                .where({ id: job_application.id })
                .whereNull('deleted_at')
                .first()
                .update(job_application)
                .then(() => {
                    res.status(204).send()
                })
                .catch(err => res.status(500).send("Nao foi possível atualizar vaga."))
        }
        else if (req.method === "POST") {

            if (job_application.id) delete job_application['id']
            job_application.applied_at = new Date()
            job_application.candidate_id=candidate.id
            app.db('job_vacancies').insert(job_application)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send("Nao foi possível cadastrar vaga."))
        }
    }

    const getJobVacancyById = (req, res) => {

        const id = req.params.id

        app.db('job_vacancies')
            .where({ id })
            .whereNull('deleted_at')
            .first()
            .then(job_application_from_db => {
                let job_application = {
                    title: job_application_from_db.title,
                    description: job_application_from_db.description,
                    recruitment_stages: job_application_from_db.recruitment_stages,
                    open_vacancies: job_application_from_db.open_vacancies,
                    id: job_application_from_db.id
                }
                return res.json(job_application)
            })
            .catch(err => res.status(500).send())

    }

    const get = (req, res) => {
        app.db('job_vacancies')
            .select('id', 'title', 'description', 'recruitment_stages', 'open_vacancies','admin_id','applied_at')
            .whereNull('deleted_at')
            .then(job_vacancies => res.json(job_vacancies))
            .catch(() => res.status(502).send())
    }

   /* const remove = (req, res) => {
        const job_application = { ...req.body }
        app.db('job_vacancies')
            .where({ id: job_application.id })
            .whereNull('deleted_at')
            .first()
            .update({ deleted_at: new Date() })
            .then(() => res.status(204).send())
            .catch((e) => {
                res.status(501).send()
            }
            )
    }*/

    return { getJobVacancyById, save, get}
}

