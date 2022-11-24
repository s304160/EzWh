var express = require('express');
var cookieParser = require('cookie-parser');
const { body, param, validationResult } = require('express-validator');
const passport = require('passport');

const DAO = require('../modules/DataImplementation/DAO');
const UserManager = require('../modules/User/UserManager');
const { isLoggedIn, hasPermission } = require('../utils');

var router = express.Router();
const database = new DAO("ezwhDb.sqlite");

// middleware that is specific to this router
router.use((req, res, next) => {
    next()
})

//Returns user informations if logged in.
router.get('/api/userinfo',
    isLoggedIn,
    function (req, res, next) {
        try {
            return res.status(200).json(req.user);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });

//Return an array containing all suppliers.
router.get('/api/suppliers',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    async function (req, res, next) {
        try {
            const suppliers = await req.app.locals.userManager.getSuppliers();
            return res.status(200).json(suppliers);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });

//Return an array containing all users excluding managers.
router.get('/api/users',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    async function (req, res, next) {
        try {
            //const users = await database.getUsers();
            const users = await req.app.locals.userManager.getUsers();
            return res.status(200).json(users);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });

//Creates a new user.
router.post("/api/newUser",
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    body("username").isEmail(),
    body("password").isLength({ min: 8 }),
    body("type").isIn([UserManager.CUSTOMER, UserManager.QUALITY_EMPLOYEE,
    UserManager.CLERK, UserManager.DELIVERY_EMPLOYEE, UserManager.SUPPLIER]),
    async function (req, res, next) {
        try {
            //Validate body request
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json("Validation of request body failed or attempt to create manager or administrator accounts");
            }

            // Check if username already exists for the given type
            const users = await req.app.locals.userManager.getUsers();
            const exists = users.filter((u) => u.email === req.body.username && u.type === req.body.type).length
            if (exists > 0) {
                return res.status(409).json("User with same mail and type already exists");
            }

            await req.app.locals.userManager
                .createUser(
                    req.body.username,
                    req.body.name,
                    req.body.surname,
                    req.body.password,
                    req.body.type);

            return res.status(201).json();
        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });

//Login of managers
router.post("/api/managerSessions",
    passport.authenticate('local'),
    body("username").isEmail(), async function (req, res, next) {
        try {
            const user = await req.app.locals.userManager.authenticate(req.body.username, req.body.password);
            return res.status(200).json({ id: user.id, username: user.username, name: user.name, surname: user.surname });

        }
        catch (err) {
            console.log(err);
            if (err === "Unauthorized")
                return res.status(401).json("wrong username and/or password");

            return res.status(500).json(err);
        }
    });

//Login of customers
router.post("/api/customerSessions",
    passport.authenticate('local'),
    body("username").isEmail(), async function (req, res, next) {
        try {
            const user = await req.app.locals.userManager.authenticate(req.body.username, req.body.password);
            return res.status(200).json({ id: user.id, username: user.username, name: user.name, surname: user.surname });

        }
        catch (err) {
            console.log(err);
            if (err === "Unauthorized")
                return res.status(401).json("wrong username and/or password");

            return res.status(500).json(err);
        }
    });

//Login of suppliers
router.post("/api/supplierSessions",
    passport.authenticate('local'),
    body("username").isEmail(), async function (req, res, next) {
        try {
            const user = await req.app.locals.userManager.authenticate(req.body.username, req.body.password);
            return res.status(200).json({ id: user.id, username: user.username, name: user.name, surname: user.surname });

        }
        catch (err) {
            console.log(err);
            if (err === "Unauthorized")
                return res.status(401).json("wrong username and/or password");

            return res.status(500).json(err);
        }
    });

//Login of clerks
router.post("/api/clerkSessions",
    passport.authenticate('local'),
    body("username").isEmail(), async function (req, res, next) {
        try {
            const user = await req.app.locals.userManager.authenticate(req.body.username, req.body.password);
            return res.status(200).json({ id: user.id, username: user.username, name: user.name, surname: user.surname });

        }
        catch (err) {
            console.log(err);
            if (err === "Unauthorized")
                return res.status(401).json("wrong username and/or password");

            return res.status(500).json(err);
        }
    });

//Login of quality employees
router.post("/api/qualityEmployeeSessions",
    passport.authenticate('local'),
    body("username").isEmail(), async function (req, res, next) {
        try {
            const user = await req.app.locals.userManager.authenticate(req.body.username, req.body.password);
            return res.status(200).json({ id: user.id, username: user.username, name: user.name, surname: user.surname });

        }
        catch (err) {
            console.log(err);
            if (err === "Unauthorized")
                return res.status(401).json("wrong username and/or password");

            return res.status(500).json(err);
        }
    });

//Login of delivery employees
router.post("/api/deliveryEmployeeSessions",
    passport.authenticate('local'),
    body("username").isEmail(), async function (req, res, next) {
        try {
            const user = await req.app.locals.userManager.authenticate(req.body.username, req.body.password);
            return res.status(200).json({ id: user.id, username: user.username, name: user.name, surname: user.surname });

        }
        catch (err) {
            console.log(err);
            if (err === "Unauthorized")
                return res.status(401).json("wrong username and/or password");

            return res.status(500).json(err);
        }
    });

//Perfoms logout
router.post("/api/logout", function (req, res, next) {
    try {
        req.logout(() => {
            return res.status(200).json();
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }

});

//Modify rights of a user, given its username. Username is the email of the user.
router.put('/api/users/:username',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("username").isEmail(),
    body("oldType").isIn([UserManager.CUSTOMER, UserManager.QUALITY_EMPLOYEE, UserManager.CLERK, UserManager.DELIVERY_EMPLOYEE, UserManager.SUPPLIER]),
    body("newType").isIn([UserManager.CUSTOMER, UserManager.QUALITY_EMPLOYEE, UserManager.CLERK, UserManager.DELIVERY_EMPLOYEE, UserManager.SUPPLIER]),
    async function (req, res, next) {

        try {
            var errors;
            //Validate body request
            if (!(errors = validationResult(req)).isEmpty()) {
                return res.status(422).json("Validation of request body failed or attempt to modify rights to administrator or manager")
            }

            // Check for correct params
            const users = await req.app.locals.userManager.getUsers();
            const exists = users.filter((u) => u.email === req.params.username && u.type === req.body.oldType).length;
            console.log()
            if (exists <= 0) {
                return res.status(404).json("Wrong username or oldType fields or user doesn't exists");
            }

            await req.app.locals.userManager.modifyRights(req.params.username, req.body.oldType, req.body.newType);
            return res.status(200).json();
        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }

    });

//Modify rights of a user, given its username. Username is the email of the user.
router.put('/api/users/:username',
    param("username").isEmail(),
    body("oldType").isIn([UserManager.CUSTOMER, UserManager.QUALITY_EMPLOYEE, UserManager.CLERK, UserManager.DELIVERY_EMPLOYEE, UserManager.SUPPLIER]),
    body("newType").isIn([UserManager.CUSTOMER, UserManager.QUALITY_EMPLOYEE, UserManager.CLERK, UserManager.DELIVERY_EMPLOYEE, UserManager.SUPPLIER]),
    async function (req, res, next) {
        // Get cookies
        try {
            var user = cookieParser.JSONCookies(req.cookies);
        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }

        try {
            var errors;
            //Validate body request
            if (!(errors = validationResult(req)).isEmpty()) {
                return res.status(422).json("Validation of request body failed or attempt to modify rights to administrator or manager")
            }

            // Check for correct params
            const users = await req.app.locals.userManager.getUsers();
            const exists = users.filter((u) => u.email === req.params.username && u.type === req.body.oldType).length;
            console.log()
            if (exists <= 0) {
                return res.status(404).json("Wrong username or oldType fields or user doesn't exists");
            }

            await req.app.locals.userManager.modifyRights(req.params.username, req.body.oldType, req.body.newType);
            return res.status(200).json();
        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }

    });

//Deletes the user identified by username (email) and type.
router.delete('/api/users/:username/:type',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("type").isIn([UserManager.CUSTOMER, UserManager.QUALITY_EMPLOYEE, UserManager.CLERK, UserManager.DELIVERY_EMPLOYEE, UserManager.SUPPLIER]),
    param("username").isEmail(),
    async function (req, res, next) {

        try {
            //Validate body request
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json("Validation of request hader failed or attempt to delete a manager/administrator")
            }

            await req.app.locals.userManager.deleteUser(req.params.username, req.params.type);
            return res.status(204).json();
        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });

module.exports = router;
