module.exports = (middleware) =>{

    const admin = function(){ return (req, res, next) => {
        if (req.user.loggedAs === 'operator' && req.user.admin) {
            middleware(req, res, next)
        }
        else {
            res.status(401).send('Usuário nao tem permissäo.')
        }
    }
}
    return {admin}

}