

module.exports = app => {

    const save = async (req, res) => {
        let job_vacancy = { ...req.body }
        const admin_token = { ...req.user }


        if (job_vacancy.created_at) delete job_vacancy['created_at']



        try {
            if (req.method === "PUT") {

                app.api.validation.existsOrError(job_vacancy, "Insira os dados que deseja modificar na vaga de emprego.")
                if (job_vacancy.title) app.api.validation.existsOrError(job_vacancy.title, "Insira um título da vaga.")
                if (job_vacancy.description) app.api.validation.existsOrError(job_vacancy.description, "Insira a descrição da vaga.")

            }
            else if (req.method === "POST") {
                app.api.validation.existsOrError(job_vacancy.title, "Insira um título da vaga.")
                app.api.validation.existsOrError(job_vacancy.description, "Insira a descrição da vaga.")

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
            .first()
            .then(job_vacancy_from_db => {
                let job_vacancy = {
                    title: job_vacancy_from_db.title,
                    description: job_vacancy_from_db.description,
                    id: job_vacancy_from_db.id
                }
                return res.json(job_vacancy)
            })
            .catch(err => res.status(500).send())

    }

    const get = (req, res) => {
        app.db('job_vacancies')
            .select('id', 'title', 'description', 'admin_id', 'created_at')
            .then(job_vacancies => res.json(job_vacancies))
            .catch(() => res.status(500).send())
    }

    const getAllVacancyCandidates = async (req, res) => {
        const vacancy_id = req.params.vacancy_id
        const admin = { ...req.user }

        try {
            const vacancy = await app.db('job_vacancies')
                .select(['admin_id'])
                .where({ id: vacancy_id })
                .first()

            console.log(vacancy)

            if (!vacancy) return res.status(404).send('Vaga nao encontrada.')
            if (vacancy.admin_id !== admin.id) return res.status(401).send('Voce so pode acessar dados sobre vagas de sua autoria.')

            const applications = await app.db('job_applications')
                .select(['id', 'candidate_id', 'stage', 'applied_at'])
                .where({ vacancy_id })

            console.log('Aqui1')
            if (applications.length === 0) return res.status(400).send('Nao foram encontradas candidaturas.')

            const applications_candidates_array = applications.map((application) => application.candidate_id)

            const candidates = await app.db('candidates')
                .select(['id', 'name', 'email', 'phone', 'cpf'])
                .whereIn('id', applications_candidates_array)

            console.log('candidates')
            console.log(candidates)

            const data = applications.map(application => {

                candidate_to_send = candidates.find(candidate => {
                    if (candidate.id === application.candidate_id) return true
                    return false
                })
                console.log('candidate.find')
                console.log(candidate_to_send)
                delete candidate_to_send['id']

                return {
                    application: {
                        id: application.id,
                        stage: application.stage,
                        applied_at: application.applied_at
                    },
                    candidate: { ...candidate_to_send }
                }

            })

            console.log('data')
            console.log(data)

            return res.json(data)




        }
        catch (e) {
            return res.status(500).send('Erro interno.' + e)
        }


    }

    const getAllAdminVacancies = async (req, res) => {
        const admin_token = { ...req.user }
        try {
            const vacancies = await app.db('job_vacancies')
                .select(['id', 'created_at', 'title', 'description'])
                .where({ admin_id: admin_token.id })

            if (vacancies.length === 0) return res.status(404).send('Nao foram encontradas vagas.')
            return res.json(vacancies)
        }
        catch (e) {
            return res.status(500).send('Erro interno')
        }


    }

    const remove = async (req, res) => {


        const administrator_token = { ...req.user }
        const vacancy = { ...req.body }
        app.db('job_vacancies')
            .where({ id: vacancy.id, admin_id: administrator_token.id })
            .first()
            .del()
            .then(_ => res.status(204).send())
            .catch(e => res.status(500).send('Nao foi possivel remover vaga.'))

    }

    return { getJobVacancyById, save, get, remove, getAllVacancyCandidates, getAllAdminVacancies }
}

