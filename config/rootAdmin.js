const bcrypt = require('bcrypt-nodejs')
const config = require('../knexfile.js')
module.exports = app => {

    const encryptPassword = (password) => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }


    const root_admin = {
        registered_at: new Date(),
        name: 'admin',
        email: 'admin@admin.com',
        cpf: '777',
        phone: '(11)1111111111',
        password: encryptPassword('12345')
    }


    //-- cadastrando o usuario root
    const registerRootAdmin = async () => {
        await app.db.migrate.latest([config])

        const admin = await app.db('administrators')
            .where({ email: 'admin@admin.com' })
   // --==--         .whereNull('deleted_at')
            .first()
            .catch(() => console.log("Admin já cadastrado!"))


        if (!admin || admin === []) {
            await app.db('administrators').insert([root_admin]).then(_ => console.log("Admin cadastrado!!"))
        }
        else console.log("Admin cadastrado!!!")

    }

    const isRootAdmin = (token) => {

        if (root_admin.name === token.name && root_admin.email === token.email && root_admin.cpf === token.cpf && root_admin.phone === token.phone) {
            return true
        }

        return false


    }

    return { registerRootAdmin, isRootAdmin }
}
//--