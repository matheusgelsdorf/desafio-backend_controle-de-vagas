module.exports = (middleware) => {

    const admin = function () {
        return (req, res, next) => {

            if (req.user.isAdmin) {
                middleware(req, res, next)
            }
            else {

                res.status(401).send('Usuário nao tem permissäo.')
            }
        }
    }

    const candidate = function () {
        return (req, res, next) => {

            if (!req.user.isAdmin) {
                middleware(req, res, next)
            }
            else {
                res.status(401).send('Usuário nao tem permissäo.')
            }
        }
    }
    return { admin, candidate }

}