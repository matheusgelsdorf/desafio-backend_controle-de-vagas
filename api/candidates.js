const bcrypt = require('bcrypt-nodejs')

module.exports = app => {

    const encryptPassword = (password) => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }


    const save = (req, res) => {
        const candidate = {...req.body}
        const candidate_token = {...req.user }

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
                .where({ id: candidate_token.id })
                .whereNull('deleted_at')
                .first()
                .update(candidate)
                .then(() => {
                    res.status(204).send()
                })
                .catch(err => res.status(500).send("Nao foi possível atualizar candidatura."))
        }
        else if (req.method === "POST") {

            if (candidate.id) delete candidate['id']
            candidate.registered_at = new Date()
            app.db('candidates').insert(candidate)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send("Nao foi possível cadastrar candidatura."))
        }
    }

    const getCandidateByCpf = (req, res) => {

        const cpf = req.params.cpf

        app.db('candidates')
            .where({ cpf })
            .whereNull('deleted_at')
            .first()
            .then(candidate_from_db => {
                let candidate = {
                    name: candidate_from_db.name,
                    email: candidate_from_db.email,
                    cpf: candidate_from_db.cpf,
                    phone: candidate_from_db.phone,
                    id: candidate_from_db.id
                }
                return res.json(candidate)
            })
            .catch(err => res.status(500).send())

    }

    const get = (req, res) => {
        app.db('candidates')
            .select('id', 'name', 'cpf', 'email', 'phone')
            .whereNull('deleted_at')
            .then(candidates => res.json(candidates))
            .catch(() => res.status(502).send())
    }

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

    return { getCandidateByCpf, save, get}
}

