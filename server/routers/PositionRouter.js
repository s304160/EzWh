const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { isLoggedIn, hasPermission } = require('../utils');
const UserManager = require('../modules/User/UserManager');

// middleware specific to this router
router.use((req, res, next) => {
    next()
})

//Get all positions
router.get('/api/positions',
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.CLERK),
    async function (req, res) {

        try {
            const positions = await req.app.locals.positionManager.getPositions();

            return res.status(200).json(positions);

        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });

//Create a new position
router.post("/api/position",
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    body("positionID").isLength({ min: 12, max: 12 }),
    body("aisleID").isLength({ min: 4, max: 4 }),
    body("row").isLength({ min: 4, max: 4 }),
    body("col").isLength({ min: 4, max: 4 }),
    body("maxWeight").isInt(),
    body("maxVolume").isInt(),
    async function (req, res) {

        try {
            if (!validationResult(req).isEmpty() ||
                req.body.positionID !== (req.body.aisleID.concat(req.body.row, req.body.col)))
                return res.status(422).json("validation of request body failed");

            await req.app.locals.positionManager
                .storePosition(
                    req.body.positionID,
                    req.body.aisleID,
                    req.body.row,
                    req.body.col,
                    req.body.maxWeight,
                    req.body.maxVolume);

            return res.status(201).json();

        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });

//Modify Position by posiionId
router.put('/api/position/:positionID',
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.CLERK),
    param("positionID").isLength({ min: 12, max: 12 }),
    body("newAisleID").isLength({ min: 4, max: 4 }),
    body("newRow").isLength({ min: 4, max: 4 }),
    body("newCol").isLength({ min: 4, max: 4 }),
    body("newMaxWeight").isInt(),
    body("newMaxVolume").isInt(),
    body("newOccupiedWeight").isInt(),
    body("newOccupiedVolume").isInt(),
    async function (req, res) {

        try {
            // Validation of body
            if (!validationResult(req).isEmpty() ||
                req.body.newOccupiedWeight > req.body.newMaxWeight ||
                req.body.newOccupiedVolume > req.body.newMaxVolume)
                return res.status(422).json("validation of request body or of positionID failed");

            // Check if position exists
            const position = await req.app.locals.positionManager.getPositionByID(req.params.positionID);
            if (position === undefined)
                return res.status(404).json("no position associated to positionID");


            await req.app.locals.positionManager.modifyPositionByID(
                req.params.positionID,
                req.body.newAisleID,
                req.body.newRow,
                req.body.newCol,
                req.body.newMaxWeight,
                req.body.newMaxVolume,
                req.body.newOccupiedWeight,
                req.body.newOccupiedVolume);

            return res.status(200).json();

        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });

//Modify positionId of a position
router.put('/api/position/:positionID/changeID',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("positionID").isLength({ min: 12, max: 12 }),
    body("newPositionID").isLength({ min: 12, max: 12 }),
    async function (req, res) {
        try {

            if (!validationResult(req).isEmpty())
                return res.status(422).json("validation of request body or of positionID failed");

            // Check if position exists
            const position = await req.app.locals.positionManager.getPositionByID(req.params.positionID);
            if (position === undefined)
                return res.status(404).json("no position associated to positionID");

            await req.app.locals.positionManager.modifyPositionID(req.params.positionID, req.body.newPositionID);

            return res.status(200).json();

        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });



//Delete an position by its positionId
router.delete('/api/position/:positionID',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("positionID").isLength({ min: 12, max: 12 }),
    async function (req, res, next) {

        try {
            if (!validationResult(req).isEmpty())
                return res.status(422).json("validation of positionID failed");

            const position = await req.app.locals.positionManager.getPositionByID(req.params.positionID);

            await req.app.locals.positionManager.deletePositionByID(req.params.positionID);
            return res.status(204).json();
        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });

module.exports = router;
