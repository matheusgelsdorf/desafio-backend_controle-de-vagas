const bcrypt = require('bcrypt-nodejs')
const config = require('../knexfile.js')
module.exports = app => {

/*const encryptPassword = (password) => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }*/


//-- cadastrando o usuario root
const registerRootAdmin = async () => {
    await app.db.migrate.latest([config])
    
 /*   const admin = await app.db('operators')
        .where({ email: 'admin@admin.com' })
        .whereNull('deleted_at')
        .first()
        .catch(() => console.log("Admin cadastrado!"))


    if (!admin || admin === []) {
        await app.db('operators').insert([
            {
                registered_at: new Date(),
                name: 'admin',
                email: 'admin@admin.com',
                cpf: '777',
                rg: '777',
                password: encryptPassword('12345'),
                admin: true
            }
        ]).then(_ => console.log("Admin cadastrado!!"))
    }
    else console.log("Admin cadastrado!!!")*/

}

return {registerRootAdmin}
}
//--