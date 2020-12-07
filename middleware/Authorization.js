module.exports.mustBeAdmin = (req, res, next) => {
    if(req.session !== undefined && accessLevel (req.session.authLevels) === "admin"){
        next();
    } else {
        res.sendStatus(403);
    }
}

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