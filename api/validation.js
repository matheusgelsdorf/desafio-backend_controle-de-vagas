module.exports = app => {
    function existsOrError(value, msg) {
        if (!value) throw msg
        if (Array.isArray(value) && value.length === 0) throw msg
        if (typeof value === 'string' && !value.trim()) throw msg
        if (value instanceof Object && Object.keys(value).length === 0) throw msg
    }

    function notExistsOrError(value, msg) {
        try {
            existsOrError(value, msg)
        } catch (msg) {
            return
        }
        throw msg
    }

    function equalsOrError(valueA, valueB, msg) {
        if (valueA !== valueB) throw msg
    }

 /* [***] */  function isValidElement(element, elementFromDb, msg) {
        if (!(element && elementFromDb)) throw ('Erro interno')

        if (elementFromDb.name && !(element.name === elementFromDb.name)) throw /*'name '+m */msg
        if (elementFromDb.cpf && !(element.cpf === elementFromDb.cpf)) throw /*'cpf '+ */msg
        if (elementFromDb.rg && !(element.rg === elementFromDb.rg)) throw/*'rg '+ */msg
        if (elementFromDb.email && !(element.email === elementFromDb.email)) throw /*'email '+ */msg
        if (elementFromDb.registrationNumber && !(element.registrationNumber === elementFromDb.registrationNumber)) throw /*'Matricula '+ */msg
        if (elementFromDb.userId && !(element.userId === elementFromDb.userId)) throw /*'userId'+ */msg

    }


    function validateEmail(email, msg) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (!re.test(email)) throw msg
    }


    return {
        existsOrError,
        notExistsOrError,
        equalsOrError,
        isValidElement,
        validateEmail        
    }
}