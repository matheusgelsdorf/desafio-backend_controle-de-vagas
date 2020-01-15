let port = process.env.PORT || 3000
const app = require('express')()
const consign = require('consign')
const db = require('./config/db')

app.db = db

app.mongoose = mongoose

consign()
    //.then('./config/rootAdmin.js') [***]
    //.then('./config/passport.js') [***]
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    //.then('./schedule')   [***]
    .then('./api')
    .then('./config/routes.js')
    .into(app)


app.config.rootAdmin.registerRootAdmin()

app.listen(port, () => {
    console.log("Backend Executando")
})

