var express = require('express');
const { body, validationResult, param } = require('express-validator');
const UserManager = require('../modules/User/UserManager');
const { isLoggedIn, hasPermission } = require('../utils');
var router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
    next()
})

//Get all test descriptors
router.get('/api/testDescriptors',
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.QUALITY_EMPLOYEE),
    async function (req, res, next) {

        try {
            const testDescriptors = await req.app.locals.skuManager.getTestDescriptors();
            return res.status(200).json(testDescriptors)
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });

//Get a test descriptor by id
router.get('/api/testDescriptors/:id',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("id").isInt(),
    async function (req, res, next) {

        try {
            // Param validation
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json(`validation of id failed`);
            }

            const testDescriptor = await req.app.locals.skuManager.getTestDescriptorByID(req.params.id);
            if (testDescriptor === undefined) {
                return res.status(404).json("no test descriptor associated id")
            }

            return res.status(200).json(testDescriptor)
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });

//Get a test descriptor by id
router.get('/api/testDescriptors/:id',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("id").isInt(),
    async function (req, res, next) {

        try {
            // Param validation
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json(`validation of id failed`);
            }

            const testDescriptor = await req.app.locals.skuManager.getTestDescriptorByID(req.params.id);
            if (testDescriptor === undefined) {
                return res.status(404).json("no test descriptor associated id")
            }

            return res.status(200).json(testDescriptor)
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });

//Create a new test descriptor
router.post("/api/testDescriptor",
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    body("name").isString(),
    body("idSKU").isInt(),
    body("procedureDescription").isString(),
    async function (req, res, next) {

        try {
            // Validation of body
            if (!validationResult(req).isEmpty()) {
                return res.status(422)
                    .json(`validation of request body failed`);
            }

            // Check if sku exists
            const SKU = await req.app.locals.skuManager.getSKUByID(req.body.idSKU);
            if (SKU === undefined) {
                return res.status(404).json("no sku associated idSKU");
            }

            await req.app.locals.skuManager.storeTestDescriptor(req.body.name, req.body.procedureDescription, req.body.idSKU);
            return res.status(201).json()
        }
        catch (err) {
            console.log(err);
            res.status(503).json(err);
        }
    });

//Modify a test descriptor by id
router.put('/api/testDescriptor/:id',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("id").isInt(),
    body("newName").isString(),
    body("newIdSKU").isInt(),
    body("newProcedureDescription").isString(),
    async function (req, res, next) {

        try {
            // Validation of body
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json(`validation of request body or of id failed`);
            }

            // Check if sku exists
            const SKU = await req.app.locals.skuManager.getSKUByID(req.body.newIdSKU);
            const testDescriptor = await req.app.locals.skuManager.getTestDescriptorByID(req.params.id);
            if (SKU === undefined || testDescriptor === undefined) {
                return res.status(404).json("no test descriptor associated id or no sku associated to IDSku");
            }


            await req.app.locals.skuManager.modifyTestDescriptorByID(req.params.id, req.body.newName, req.body.newProcedureDescription, req.body.newIdSKU);
            return res.status(200).json()
        }
        catch (err) {
            console.log(err);
            res.status(503).json(err);
        }
    });

//Delete a test descriptor by id
router.delete('/api/testDescriptor/:id',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("id").isInt(),
    async function (req, res, next) {

        try {
            // Validation of body
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json(`validation of id failed`);
            }

            await req.app.locals.skuManager.deleteTestDescriptor(req.params.id);
            return res.status(204).json();
        }
        catch (err) {
            console.log(err);
            res.status(503).json(err);
        }
    });

module.exports = router;
