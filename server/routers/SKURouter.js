var express = require('express');
const { body, param, validationResult } = require('express-validator');
const { isLoggedIn, hasPermission } = require('../utils');
const UserManager = require('../modules/User/UserManager');
const { CUSTOMER, CLERK } = require('../modules/User/UserManager');
var router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
    next()
})

//Create a new SKU
router.post('/api/sku',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    body("description").notEmpty(),
    body("notes").notEmpty(),
    body("weight").isInt({ min: 0 }),
    body("volume").isInt({ min: 0 }),
    body("price").isFloat({ min: 0 }),
    body("availableQuantity").isInt({ min: 0 }),
    async function (req, res, next) {
        try {
            //Validate request
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json("validation of request body failed");
            }

            await req.app.locals.skuManager.createSKU(
                req.body.description,
                req.body.weight,
                req.body.volume,
                req.body.notes,
                req.body.price,
                req.body.availableQuantity
            );
            return res.status(201).json();
        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }

    });

//Get SKUS
router.get("/api/skus",
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager, CUSTOMER, UserManager, CLERK),
    async function (req, res, next) {

        try {
            const SKUs = await req.app.locals.skuManager.getSKUs() // SKU object
            return res.status(200).json(SKUs);
        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });

//Get SKU by id
router.get('/api/skus/:id',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("id").isInt(), async function (req, res, next) {

        try {
            //Validate request
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json("validation of id failed");
            }

            const SKU = await req.app.locals.skuManager.getSKUByID(req.params.id);
            if (SKU === undefined) {
                return res.status(404).json("no SKU associated to id")
            }

            return res.status(200).json(SKU);
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });

//Modify SKU by id
router.put('/api/sku/:id',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    body("newWeight").isInt(),
    body("newVolume").isInt(),
    body("newPrice").isFloat(),
    body("newAvailableQuantity").isInt(),
    param("id").isInt(),
    async function (req, res, next) {
        try {
            //Validate request
            const newVolume = req.body.newVolume * req.body.newAvailableQuantity;
            const newWeight = req.body.newWeight * req.body.newAvailableQuantity;
            if (!validationResult(req).isEmpty()) {
                return res.status(422)
                    .json(`validation of request body failed 
            or if with newAvailableQuantity 
            position is not capable enough in weight or in volume`);
            }

            const SKU = await req.app.locals.skuManager.getSKUByID(req.params.id);
            if (SKU === undefined) {
                return res.status(404).json("SKU not existing");
            }



            if (SKU.getPosition() !== "" && req.app.locals.positionManager.isAvailable(SKU.getPosition(), newVolume, newWeight)) {
                return res.status(422)
                    .json(`position is not capable enough in weight or in volume`);
            }

            await req.app.locals.skuManager.modifySKUByID(
                req.params.id,
                req.body.newDescription,
                req.body.newWeight,
                req.body.newVolume,
                req.body.newNotes,
                req.body.newPrice,
                req.body.newAvailableQuantity);
            if (SKU.getPosition() !== "") {
                await req.app.locals.positionManager.updateOccupiedSpace(SKU.getPosition(), newVolume, newWeight);
            }
            return res.status(200).json();
        }
        catch (err) {
            console.log(err);
            res.status(503).json(err);
        }
    });

//Modify position of an SKU
router.put('/api/sku/:id/position',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("id").isInt(),
    body("position").isLength({ min: 12, max: 12 }),
    async function (req, res, next) {
        try {
            // Validate position
            if (!validationResult(req).isEmpty())
                return res.status(422).json("validation of id or request body failed");


            // Check if position exists
            const position = await req.app.locals.positionManager.getPositionByID(req.body.position);
            if (position === undefined) {
                return res.status(404).json("position not existing");
            }
            if (position.getSkuID() !== null && position.getSkuID() !== undefined) {
                return res.status(422).json(`position is already assigned to a sku`);
            }


            // Check if sku exists
            const SKU = await req.app.locals.skuManager.getSKUByID(req.params.id);
            if (SKU === undefined) {
                return res.status(404).json("SKU not existing");
            }
            if (!(await req.app.locals.positionManager.isAvailable(req.body.position, SKU.getVolume(), SKU.getWeight()))) {
                return res.status(422).json(`position isn't capable to satisfy volume and weight constraints for available quantity of sku`);
            }



            await req.app.locals.skuManager.updateSKUPosition(SKU, req.body.position);
            return res.status(200).json();
        }
        catch (err) {
            console.log(err);
            res.status(503).json(err);
        }


    });

//Delete an SKU by id
router.delete('/api/skus/:id',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("id").isInt(), async function (req, res, next) {

        try {
            //Validation of id
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json(`validation of id failed`);
            }

            await req.app.locals.skuManager.deleteSKU(req.params.id);
            return res.status(204).json()
        }
        catch (err) {
            console.log(err);
            res.status(503).json(err);
        }
    });

module.exports = router;
