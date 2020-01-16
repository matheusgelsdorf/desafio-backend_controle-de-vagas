const { authSecret } = require('../.env')

const jwt = require('jwt-simple')

const bcrypt = require('bcrypt-nodejs')

module.exports = app => {

    const signinCandidate = async (req, res) => {
        try{
            app.api.validation.existsOrError(req.body.email, "Insira o email.")
            app.api.validation.existsOrError(req.body.password, "Insira a senha.")

        }
        catch(e){
            return res.status(400).send(e)
        }

        const candidate = await app.db('candidates')
            .where({ email: req.body.email })
            .whereNull('deleted_at')
            .first()
            .catch(_ => res.status(500).send('Erro interno.'))

        if (!candidate) return res.status(400).send('Candidato não encontrado!')

        const isMatch = await bcrypt.compareSync(req.body.password, candidate.password)
        if (!isMatch) return res.status(400).send('Senha inválida!')

        const now = Math.floor(Date.now() / 1000)


        let payload = {
            id: candidate.id,
            name: candidate.name,
            email: candidate.email,
            cpf: candidate.cpf,
            phone: candidate.phone,
            isAdmin:false,
            iat: now,
            exp: now + (60 * 60 * 10)
        }
        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    const signinAdmin = async (req, res) => {
        try{
            app.api.validation.existsOrError(req.body.email, "Insira o email.")
            app.api.validation.existsOrError(req.body.password, "Insira a senha.")

        }
        catch(e){
            return res.status(400).send(e)
        }

        const admin = await app.db('administrators')
            .where({ email: req.body.email })
            .whereNull('deleted_at')
            .first()
            .catch(_ => res.status(500).send('Erro interno.'))

        if (!admin) return res.status(400).send('Administrador não encontrado!')

        const isMatch = await bcrypt.compareSync(req.body.password, admin.password)
        if (!isMatch) return res.status(400).send('Senha inválida!')

        const now = Math.floor(Date.now() / 1000)


        let payload = {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            cpf: admin.cpf,
            phone: admin.phone,
            isAdmin:true,
            iat: now,
            exp: now + (60 * 60 * 10)
        }
        res.json({
            ...payload, // usado pelo front
            token: jwt.encode(payload, authSecret)
        })
    }

   

    // Check if all token fields are valid.
    const validateToken = async (req, res) => {
        const loginData = req.body || null

        try {
            if (loginData) {
                const token = jwt.decode(loginData.token, authSecret)
                let table_id


                if (token.isAdmin) table_id = 'administrators'
                else  table_id = 'candidates'
             

                if (new Date(token.exp * 1000) > new Date()) {

                    const user_from_db = await app.db(table_id)
                        .whereNull('deleted_at')
                        .where({ id: token.id })
                        .first()
                    if ((token.name === user_from_db.name) &&
                        (token.cpf === user_from_db.cpf) &&
                        (token.email === user_from_db.email) &&
                        (token.phone === user_from_db.phone)
                    ) {
                        return res.send(true)
                    }

                }

            }
        }
        catch (e) {
            return res.send(false)
        }

        res.send(false)

    }


    return { signinCandidate, signinAdmin, validateToken}
}