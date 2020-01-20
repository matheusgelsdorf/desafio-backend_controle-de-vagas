module.exports = app => {

    const save = (req, res) => {
        const vacancy_id_set = [ ...(req.body.vacancy_id_set) ]
        const candidate = { ...req.user }
        /* Validações */

        try {
            if(!Array.isArray(vacancy_id_set)) throw('Vagas inseridas sao invalidas.')
            app.api.validation.existsOrError(vacancy_id_set, "Insira quais vagas você deseja ocupar.")
        }
        catch(e) {
            return res.status(400).send(e)
        }
        /* ---------------- */

        //if (job_application_set.id) delete job_application_set['id']
        let job_application_set = []
        vacancy_id_set.forEach((vacancy) => {
            job_application_set.push( {
                applied_at: new Date(),
                candidate_id: candidate.id,
                vacancy_id: vacancy,
                current_stage: 0,// [***] Ver se nao vou deletar
                stage: 'Em Andamento' //[***] Ver se n vou deletar
            })
        })
    
        app.db('job_applications').insert(job_application_set)
            .then(_ => res.status(204).send("Candidaturas cadastradas com sucesso."))
            .catch(err => res.status(500).send("Nao foi possivel cadastrar as candidaturas. "))
    }

    const editApplicationStage= async (req,res) => {
        const application = {
            id:req.body.id,
            stage:req.body.stage,
            admin_id:null
        }
        const admin_token = {...req.user}
        try {
            app.api.validation.existsOrError(application.stage,"Insira um estagio valido para a candidatura.")
            app.api.validation.isValidStage(application.stage,"Estagio inserido invalido.")

            app.api.validation.existsOrError(application.id,"Selecione uma candidatura valida.")

        }
        catch(e){
            return res.status(404).send(e)
        }
        
        try{
        let vacancy_id
        await app.db('job_applications')
            .select(["vacancy_id"])
            .where({ id : application.id})
            .whereNull('deleted_at')
            .first()
            .then(application_from_db => {
                vacancy_id=application_from_db.vacancy_id
            })



        await app.db('job_vacancies')
            .select(["admin_id"])
            .where({id:vacancy_id})
            .whereNull('deleted_at')
            .first()
            .then((vacancy_from_db => {
                application.admin_id=vacancy_from_db.admin_id
            }))
        

        }
        catch(e){
            return res.status(500).send("Candidatura inválida \n\n\n" + e + "\n\n\###" )
        }
        if(admin_token.id !== application.admin_id) return res.status(401).send("Apenas o administrador que criou a vaga pode editar esta candidatura.")
        
        app.db('job_applications')
                .where({ id  : application.id })
                .whereNull('deleted_at')
                .first()
                .update({ stage  :  application.stage})
                .then(() => {
                    res.status(204).send()
                })
                .catch(err => res.status(500).send("Nao foi possível atualizar estágio da candidatura."))

        
    }


    const getJobApplicationById = (req, res) => {
        const access_token = { ...req.user }
        
        const id=req.params.id 

        app.db('job_applications')
            .where({ id })
            .whereNull('deleted_at')
            .first()
            .then(job_application_from_db => {
                delete job_application_from_db['deleted_at']
                if (!access_token.isAdmin && job_application_from_db.candidate_id !== access_token.id) {
                    return res.status(401).send('Voce nao tem permissao de acessar essa candidatura.')
                }
                return res.json(job_application_from_db)
            })
            .catch(err => res.status(500).send())

    }

    const getAllCandidatesJobApplicationByID = (req, res) => {

        const candidate_id = req.user.id


        app.db('job_applications')
            .select('id', 'applied_at', 'candidate_id', 'vacancy_id', 'current_stage', 'stage') //[***] Current stage e status ver se nao vou deletar
            .where({ candidate_id })
            .whereNull('deleted_at')
            .then(job_application_from_db_set => {
                return res.json(job_application_from_db_set)
            })
            .catch(err => res.status(500).send("Candidato nao possui candidaturas."))

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

    return { getAllCandidatesJobApplicationByID, getJobApplicationById, save, editApplicationStage}
}

