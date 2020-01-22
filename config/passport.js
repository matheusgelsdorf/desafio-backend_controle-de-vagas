const { authSecret } = require('../.env')

const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params, (payload, done) => {
        
        if (new Date(payload.exp * 1000) < new Date()) {
            return done('Token Expirado.', false)
        }
       

        if (payload.isAdmin) {
            app.db('administrators')
                .where({ id: payload.id })
    // --==--            .whereNull("deleted_at")
                .first()
                .then(admin_from_db => {
                
                    if (
                        admin_from_db &&
                        payload.email === admin_from_db.email &&
                        payload.cpf === admin_from_db.cpf &&
                        payload.name === admin_from_db.name &&
                        payload.phone === admin_from_db.phone
                    ) {
                        return done(null, { ...payload })
                    }
                    else {
                        throw ('Login Inválido. Administrator') //[***] Verificar se precisa desse log.
                    }

                })
                .catch(err =>{ 
                    done(err, false)
                })
        }

        else{

            app.db('candidates')
                .where({ id: payload.id })
     // --==--           .whereNull("deleted_at")
                .first()
                .then(candidate_from_db => {
                    if (
                        candidate_from_db &&
                        payload.email === candidate_from_db.email &&
                        payload.cpf === candidate_from_db.cpf &&
                        payload.name === candidate_from_db.name &&
                        payload.phone === candidate_from_db.phone 
                    ) {
                        return done(null, { ...payload })
                    }
                    else {
                        throw ('Login Inválido. User') //[***] Verificar se precisa desse log.
                    }

                })
                .catch(err => done(err, false))
        }
    })

    passport.use(strategy)

    return {
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}