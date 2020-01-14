const { authSecret } = require('../.env')

const jwt = require('jwt-simple')

const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signin = async (req, res) => {
        let table = req.body.tableId
        if (!(req.body.cpf || req.body.password)) {
            return res.status(400).send('Informe usuário e senha')
        }
        if (!(req.body.tableId === 'operators' || req.body.tableId === 'users')) return res.status(400).send()

        const genUser = await app.db(table)
            .where({ cpf: req.body.cpf })
            .whereNull('deleted_at')
            .first()
            .catch(_ => res.status(500).send())

        if (!genUser) return res.status(400).send('Usuario nao encontrado!')

        const isMatch = await bcrypt.compareSync(req.body.password, genUser.password)
        if (!isMatch) return res.status(400).send('CPF/Senha inválidos!')

        const now = Math.floor(Date.now() / 1000)


        let payload = {
            id: genUser.id,
            name: genUser.name,
            email: genUser.email,
            cpf: genUser.cpf,
            iat: now,
            exp: now + (60 * 60 * 10)
        }
        if (table === 'operators') {
            payload.admin = genUser.admin
            payload.loggedAs = 'operator'
        }
        else if (table === 'users') {
            payload.loggedAs = 'user'
        }
        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    const signinDevice = async (req, res) => {
        const device = { ...req.body }

        if (!(device && device.macAddress && device.password)) return res.status(400).send()

        const deviceFromDb = await app.db('devices')
            .where({ macAddress: device.macAddress })
            .whereNull('deleted_at')
            .first()
            .catch(_ => {
                return res.status(500).send()
            })

        try {
            if (!deviceFromDb) res.status(500).send()
            const isMatch = await bcrypt.compareSync(device.password, deviceFromDb.password)

            if (!isMatch) return res.status(400).send()
            const now = new Date() / 1000
            let payload = {
                id: deviceFromDb.id,
                macAddress: deviceFromDb.macAddress,
                iat: now,
                exp: now + (60 * 60 * 4),
                loggedAs: 'device'
            }
            res.json({
                token: jwt.encode(payload, authSecret)
            })
        }
        catch (e) {
            console.log(e)
        }
    }

    // Check if all token fields are valid.
    const validateToken = async (req, res) => {
        const loginData = req.body || null

        try {
            if (loginData) {
                const token = jwt.decode(loginData.token, authSecret)
                let tableId


                if (token.loggedAs === 'operator') tableId = 'operators'
                else if (token.loggedAs === 'user') tableId = 'users'
                else throw ('Erro interno.')

                if (new Date(token.exp * 1000) > new Date()) {

                    const genUserFromDb = await app.db(tableId)
                        .whereNull('deleted_at')
                        .where({ id: token.id })
                        .first()
                    if ((token.name === genUserFromDb.name) &&
                        (token.cpf === genUserFromDb.cpf) &&
                        (token.email === genUserFromDb.email) &&
                        ((token.loggedAs === 'operator') ? (token.admin === genUserFromDb.admin) : true)
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


    return { signin, validateToken, signinDevice }
}