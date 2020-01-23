const bcrypt = require('bcrypt-nodejs')

module.exports = app => {

    const encryptPassword = (password) => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }


    const save = (req, res) => {
        const candidate = { ...req.body }
        const candidate_token = { ...req.user }

        if (candidate.registered_at) delete candidate['registered_at']



        try {
            if (req.method === "PUT") {
                app.api.validation.existsOrError(candidate, "Insira os dados que deseja atualizar.")
                if (candidate.name) app.api.validation.existsOrError(candidate.name, "Insira um nome.")
                if (candidate.cpf) app.api.validation.existsOrError(candidate.cpf, "Insira o cpf.")
                if (candidate.email) {
                    app.api.validation.existsOrError(candidate.email, "Insira um email válido.")
                    app.api.validation.validateEmail(candidate.email, "Email inválido.")
                }
                if (candidate.password) {

                    app.api.validation.existsOrError(candidate.password, "Insira uma senha válida.")
                    app.api.validation.existsOrError(candidate.confirmPassword, "Confirme a senha.")
                    app.api.validation.equalsOrError(candidate.password, candidate.confirmPassword, 'Senhas nao conferem.')
                }
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



        if (candidate.password) candidate.password = encryptPassword(candidate.password)
        delete candidate['confirmPassword']


        if (req.method === "PUT") {
            app.db('candidates')
                .where({ id: candidate_token.id })
                .first()
                .update(candidate)
                .then(() => {
                    res.status(204).send()
                })
                .catch(err => res.status(500).send("Nao foi possível atualizar candidato."))
        }
        else if (req.method === "POST") {

            if (candidate.id) delete candidate['id']
            candidate.registered_at = new Date()
            app.db('candidates').insert(candidate)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send("Nao foi possível cadastrar candidato."))
        }
    }

    const getCandidateByCpf = (req, res) => {
        let cpf
        if (req.user.isAdmin) {
            cpf = req.params.cpf
        }
        else {
            cpf = req.user.cpf
        }

        app.db('candidates')
            .where({ cpf })
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
            .then(candidates => res.json(candidates))
            .catch(() => res.status(502).send())
    }



    const remove = (req, res) => {
        const candidate = { ...req.user }

        app.db('candidates')
            .where({ id: candidate.id })
            .first()
            .del()
            .then(_ => res.status(204).send())
            .catch(_ => res.status(500).send('Nao foi possivel remover candidato.'))

    }

    return { getCandidateByCpf, save, get, remove }
}

