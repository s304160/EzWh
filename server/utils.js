function isLoggedIn(req, res, next) {

    //Pass on test mode
    if (process.env.NODE_ENV === "test") {
        return next();
    }

    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json("Not logged in or wrong permissions");
}

function hasPermission(...roles) {
    return (req, res, next) => {

        //Pass on test mode
        if (process.env.NODE_ENV === "test") {
            return next();
        }

        const hasRole = roles.find(role => req.user.type === role)
        if (!hasRole) {
            return res.status(401).json("Not logged in or wrong permissions");
        }

        return next()
    }
}

module.exports = {
    isLoggedIn,
    hasPermission
}