const bcrypt = require('bcrypt-nodejs')

module.exports = app => {

    const encryptPassword = (password) => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }


    const save = (req, res) => {
        const administrator = { ...req.body }
        const administrator_token = { ...req.user }

        if (administrator.registered_at) delete administrator['registered_at']

        if (administrator.deleted_at) delete administrator['deleted_at']

        /* Validações */

        try {
            if (req.method === "PUT") {
                app.api.validation.existsOrError(administrator, "Insira os dados que deseja atualizar.")
                //name 
                if (administrator.name || administrator.name === "") app.api.validation.existsOrError(administrator.name, "Insira um nome.")
                //cpf
                if (administrator.cpf || administrator.cpf === "") app.api.validation.existsOrError(administrator.cpf, "Insira o cpf.")
                //email
                if (administrator.email) {
                    app.api.validation.existsOrError(administrator.email, "Insira um email válido.")
                    app.api.validation.validateEmail(administrator.email, "Email inválido.")
                }
                //phone
                if (administrator.phone || administrator.phone === "") app.api.validation.existsOrError(administrator.phone, "Insira um número de telefone")

            }
            else if (req.method === "POST") {
                app.api.validation.existsOrError(administrator.name, "Insira um nome.")
                app.api.validation.existsOrError(administrator.email, "Insira um email.")
                app.api.validation.validateEmail(administrator.email, "Email inválido.")

                app.api.validation.existsOrError(administrator.cpf, "Insira o cpf.")
                app.api.validation.existsOrError(administrator.password, "Insira a senha.")
                app.api.validation.existsOrError(administrator.phone, "Insira um número de telefone")
                app.api.validation.existsOrError(administrator.confirmPassword, "Confirme a senha.")
                app.api.validation.equalsOrError(administrator.password, administrator.confirmPassword, 'Senhas não conferem.')

            }
        }
        catch (e) {
            return res.status(400).send(e)
        }
        /* ---------------- */



        if (administrator.password) administrator.password = encryptPassword(administrator.password) // caso o metodo for PUT
        delete administrator['confirmPassword']


        if (req.method === "PUT") {
            app.db('administrators')
                .where({ id: administrator_token.id })
                .whereNull('deleted_at')
                .first()
                .update(administrator)
                .then(() => {
                    res.status(204).send()
                })
                .catch(err => res.status(500).send("Nao foi possível atualizar administrador."))
        }
        else if (req.method === "POST") {

            if (administrator.id) delete administrator['id']
            administrator.registered_at = new Date()
            app.db('administrators').insert(administrator)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send("Nao foi possível cadastrar administrador."))
        }
    }

    const getAdministratorByCpf = (req, res) => {

        const cpf = req.user.cpf

        app.db('administrators')
            .where({ cpf })
            .whereNull('deleted_at')
            .first()
            .then(administrator_from_db => {
                let administrator = {
                    name: administrator_from_db.name,
                    email: administrator_from_db.email,
                    cpf: administrator_from_db.cpf,
                    phone: administrator_from_db.phone,
                    id: administrator_from_db.id
                }
                return res.json(administrator)
            })
            .catch(err => res.status(500).send())

    }

    const get = (req, res) => {
        app.db('administrators')
            .select('id', 'name', 'cpf', 'email', 'phone')
            .whereNull('deleted_at')
            .then(administrators => res.json(administrators))
            .catch(() => res.status(502).send())
    }

    const remove = (req, res) => {


        const administrator = app.config.rootAdmin.isRootAdmin(req.user) ? { ...req.body } : { ...req.user }

        if (app.config.rootAdmin.isRootAdmin(administrator)) {
            try {
                app.api.validation.existsOrError(administrator.id, "Insira um id de um administrador.")
            }
            catch (e) {
                return res.status(404).send(e)
            }
        }

        app.db('administrators')
            .where({ id: administrator.id })
            .first()
            .del()
            .then(_ => res.status(204).send())
            .catch(_ => res.status(500).send('Nao foi possivel remover administrador.'))

    }

    return { getAdministratorByCpf, save, get, remove }
}

