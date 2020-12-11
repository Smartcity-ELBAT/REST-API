/**
 *@swagger
 * components:
 *  responses:
 *      mustBeAdmin:
 *          description: L'action demandée ne peut être réalisée que par un administrateur
 */

module.exports.mustBeAdmin = (req, res, next) => {
    console.log(req.session);
    console.log(req.session.authLevels);

    if(req.session !== undefined && accessLevel (req.session.authLevels) === "admin"){
        next();
    } else {
        res.sendStatus(403);
    }
}

/**
 *@swagger
 * components:
 *  responses:
 *      mustBeWaiter:
 *          description: L'action demandée ne peut être réalisée que par un serveur
 */

module.exports.mustBeWaiter = (req, res, next) => {
    if(req.session !== undefined && accessLevel (req.session.authLevels) === "waiter"){
        next();
    } else {
        res.sendStatus(403);
    }
}

function accessLevel (authLevels){
    let accessLevel = "customer";
    for(let authLevel of authLevels){
        if(authLevel.accessLevel === "admin")
            accessLevel = "admin";
        else if(authLevel.accessLevel.split("_")[0] === "waiter")
            accessLevel = "waiter";
    }
    return accessLevel;
}