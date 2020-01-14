const bcrypt = require('bcrypt-nodejs')

module.exports = app => {

    const encryptPassword = (password) => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }


    const save = (req, res) => {
        const candidate = { ...req.body }
        const candidateToken = { ...req.user }

        if (candidate.registered_at) delete candidate['registered_at']

        if (candidate.deleted_at) delete candidate['deleted_at']

        /* Validações */

        try {
            if (req.method === "PUT") {
                //name
                if (candidate.name) app.api.validation.existsOrError(candidate.name, "Insira um nome.")
                //cpf
                if (candidate.cpf) app.api.validation.existsOrError(candidate.cpf, "Insira o cpf.")
                //email
                if (candidate.email) app.api.validation.existsOrError(candidate.email, "Insira um email válido.")
                app.api.validation.validateEmail(candidate.email, "Email inválido.")
                //senha
                if (candidate.password) {

                    app.api.validation.existsOrError(candidate.password, "Insira uma senha válida.")
                    app.api.validation.existsOrError(candidate.confirmPassword, "Confirme a senha.")
                    app.api.validation.equalsOrError(candidate.password, candidate.confirmPassword, 'Senhas nao conferem.')
                }
                //phone
                if (candidate.phone) app.api.validation.existsOrError(candidate.phone, "Insira um número de telefone")

            }
            else if (req.method === "POST") {
                app.api.validation.existsOrError(candidate.name, "Insira um nome.")
                app.api.validation.existsOrError(candidate.email, "Insira um email.")
                app.api.validation.validateEmail(candidate.email, "Email inválido.")

                app.api.validation.existsOrError(candidate.cpf, "Insira o cpf.")
                app.api.validation.existsOrError(candidate.password, "Insira a senha.")
                app.api.validation.existsOrError(candidate.phone, "Insira um número de telefone")
                app.api.validation.existsOrError(candidate.confirmPassword, "Confirme a senha.")
                app.api.validation.equalsOrError(candidate.password, candidate.confirmPassword, 'Senhas não conferem.')

            }
        }
        catch (e) {
            return res.status(400).send(e)
        }
        /* ---------------- */



        if (candidate.password) candidate.password = encryptPassword(candidate.password) // caso o metodo for PUT
        delete candidate['confirmPassword']


        if (req.method === "PUT") {
            app.db('candidates')
                .where({ id: candidateToken.id })
                .whereNull('deleted_at')
                .first()
                .update(candidate)
                .then(candidates => {
                    res.status(204).send()
                })
                .catch(err => res.status(500).send("Nao foi possível atualizar usuário."))
        }
        else if (req.method === "POST") {

            if (candidate.id) delete candidate['id']
            candidate.registered_at = new Date()
            app.db('candidates').insert(candidate)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send("Nao foi possível cadastrar usuário."))
        }
    }

    const getcandidateByCpf = (req, res) => {

        const registrationNumber = req.params.cpf

        app.db('candidates')
            .where({ cpf })
            .whereNull('deleted_at')
            .first()
            .then(candidateFromDb => {
                let candidate = {
                    name: candidateFromDb.name,
                    email: candidateFromDb.email,
                    cpf: candidateFromDb.cpf,
                    phone: candidateFromDb.phone,
                    id: candidateFromDb.id
                }
                return res.json(candidate)
            })
            .catch(err => res.status(500).send())

    }

    /*const get = (req, res) => {
        app.db('candidates')
            .select('id', 'name', 'cpf', 'rg', 'email', 'candidateType', 'course', 'registrationNumber')
            .whereNull('deleted_at')
            .then(candidates => res.json(candidates))
            .catch(() => res.status(502).send())
    }*/

   /* const remove = (req, res) => {
        const candidate = { ...req.body }
        app.db('candidates')
            .where({ id: candidate.id })
            .whereNull('deleted_at')
            .first()
            .update({ deleted_at: new Date() })
            .then(() => res.status(204).send())
            .catch((e) => {
                res.status(501).send()
            }
            )
    }*/

    return { getcandidateById, save}
}

