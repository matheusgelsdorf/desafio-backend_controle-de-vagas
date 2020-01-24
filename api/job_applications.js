module.exports = app => {

    const save = async (req, res) => {
        let vacancy_id_set = [...(req.body.vacancy_id_set)]
        const candidate = { ...req.user }

        try {
            if (!Array.isArray(vacancy_id_set)) throw ('Vagas inseridas sao invalidas.')
            app.api.validation.existsOrError(vacancy_id_set, "Insira quais vagas você deseja ocupar.")
        }
        catch (e) {
            return res.status(400).send(e)
        }



        try {
            const job_application_from_db_set = await app.db('job_applications')
                .select(['vacancy_id'])
                .where({ candidate_id: candidate.id })


            console.log(job_application_from_db_set)
            const checkRepeatedVacancys = (vacancy_id) => {
                const exists_vacancy = job_application_from_db_set.find(
                    (vacancy_from_db) => {
                        if (vacancy_from_db.vacancy_id === vacancy_id) return true
                        return false
                    }
                )
                if (exists_vacancy) return true
                return false
            }
            const repetead_vacancies_registered = vacancy_id_set.filter(checkRepeatedVacancys)
            if (repetead_vacancies_registered.length > 0) return res.status(400).send("Voce so pode ter uma candidatura por vaga.")

        }
        catch (e) {
            return res.status(500).send("Erro Interno.  " + e)
        }


        const job_application_set = vacancy_id_set.map((vacancy) => {
            return {
                applied_at: new Date(),
                candidate_id: candidate.id,
                vacancy_id: vacancy,
                stage: 'Em Andamento'
            }
        })
        app.db('job_applications').insert(job_application_set)
            .then(_ => res.status(204).send("Candidaturas cadastradas com sucesso."))
            .catch(err => res.status(500).send("Nao foi possivel cadastrar as candidaturas. "))
    }


    const editApplicationStage = async (req, res) => {
        const application = {
            id: req.body.id,
            stage: req.body.stage,
            admin_id: null
        }
        const admin_token = { ...req.user }
        try {
            app.api.validation.existsOrError(application.stage, "Insira um estagio valido para a candidatura.")
            app.api.validation.isValidStage(application.stage, "Estagio inserido invalido.")

            app.api.validation.existsOrError(application.id, "Selecione uma candidatura valida.")

        }
        catch (e) {
            return res.status(400).send(e)
        }

        try {
            let vacancy_id
            await app.db('job_applications')
                .select(["vacancy_id"])
                .where({ id: application.id })
                .first()
                .then(application_from_db => {
                    vacancy_id = application_from_db.vacancy_id
                })



            await app.db('job_vacancies')
                .select(["admin_id"])
                .where({ id: vacancy_id })
                .first()
                .then((vacancy_from_db => {
                    application.admin_id = vacancy_from_db.admin_id
                }))


        }
        catch (e) {
            return res.status(500).send("Candidatura inválida \n\n\n" + e + "\n\n\###")
        }
        if (admin_token.id !== application.admin_id) return res.status(401).send("Apenas o administrador que criou a vaga pode editar esta candidatura.")

        app.db('job_applications')
            .where({ id: application.id })
            .first()
            .update({ stage: application.stage })
            .then(() => {
                res.status(204).send()
            })
            .catch(err => res.status(500).send("Nao foi possível atualizar estágio da candidatura."))


    }


    const getJobApplicationById = async (req, res) => {
        const access_token = { ...req.user }

        const id = req.params.id

        try {
            const job_application_from_db = await app.db('job_applications')
                .where({ id })
                .first()

            if (!job_application_from_db) res.status(404).send('Candidatura nao encontrada.')

            if (!access_token.isAdmin && job_application_from_db.candidate_id !== access_token.id) {
                return res.status(401).send('Voce nao tem permissao para acessar essa candidatura.')
            }
            const vacancy_from_db = await app.db('job_vacancies')
                .where({ id: job_application_from_db.vacancy_id })
                .first()

            if (access_token.isAdmin && vacancy_from_db.admin_id !== access_token.id) return res.status(401).send('Voce nao tem permissao para acessar essa candidatura.')

            return res.json(job_application_from_db)

        }
        catch (e) {
            return res.status(500).send('Erro interno.')
        }

    }

    const getAllCandidatesJobApplicationByID = (req, res) => {

        const candidate_id = req.user.id


        app.db('job_applications')
            .select('id', 'applied_at', 'candidate_id', 'vacancy_id', 'stage')
            .where({ candidate_id })
            .then(job_application_from_db_set => {
                return res.json(job_application_from_db_set)
            })
            .catch(err => res.status(500).send("Candidato nao possui candidaturas."))

    }



    const remove = async (req, res) => {


        const candidate_token = { ...req.user }
        const application = { ...req.body }

        app.db('job_applications')
            .where({ id: application.id, candidate_id: candidate_token.id })
            .first()
            .del()
            .then(_ => res.status(204).send())
            .catch(_ => res.status(500).send('Nao foi possivel remover candidatura.'))

    }

    return { getAllCandidatesJobApplicationByID, getJobApplicationById, save, editApplicationStage, remove }
}

