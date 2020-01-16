module.exports = app => {

    const save = (req, res) => {
       vacancy_id_set={...(req.body.vacancy_id_set)}

        const candidate = {...req.user }

        

        /* Validações */

        try {
           
                app.api.validation.existsOrError(vacancy_id_set_set, "Insira quais vagas você deseja ocupar.")
            }
        catch (e) {
            return res.status(400).send(e)
        }
        /* ---------------- */


           
            if (job_application_set.id) delete job_application_set['id']
            let job_application_set=[]
            vacancy_id_set.forEach((vacancy) => {
                    job_application_set.push= {
                    appliet_at: new Date(),
                    candidate_id: candidate.id,
                    vacancy_id:vacancy,
                    current_stage:0,// [***] Ver se nao vou deletar
                    status:'Em Andamento' //[***] Ver se n vou deletar
                }  
            });
            app.db('job_vacancies').insert(job_application_set)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send("Nao foi possível cadastrar as candidaturas."))
    }
    

    const getJobApplicationById = (req, res) => {
        const id = req.params.id
        app.db('job_applications')
            .where({ id })
            .whereNull('deleted_at')
            .first()
            .then(job_application_from_db => {
                delete job_application_from_db['deleted_at']
                return res.json(job_application_from_db)
            })
            .catch(err => res.status(500).send())

    }

    const getAllCandidatesJobApplicationByID = (req, res) => {

        const candidate_id = req.user.id


        app.db('job_applications')
            .select('id', 'applied_at', 'candidate_id', 'vacancy_id', 'current_stage','status') //[***] Current stage e status ver se nao vou deletar
            .where({ candidate_id })
            .whereNull('deleted_at')
            .then(job_application_from_db_set => {
                return res.json(job_application_from_db_set)
            })
            .catch(err => res.status(500).send())

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

    return { getAllCandidatesJobApplicationByID,getJobVacancyById, save}
}

