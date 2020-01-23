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

    function validateEmail(email, msg) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (!re.test(email)) throw msg
    }

    function isValidStage(stage, msg) {
        const stages_array=['Em Andamento','Aprovado','Reprovado']
        if ( !stages_array.includes(stage)) throw(msg)
    }

    return {
        existsOrError,
        notExistsOrError,
        equalsOrError,
        validateEmail,
        isValidStage        
    }
}