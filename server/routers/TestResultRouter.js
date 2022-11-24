const dayjs = require('dayjs');
var express = require('express');
const { body, validationResult, param } = require('express-validator');
const { QUALITY_EMPLOYEE } = require('../modules/User/UserManager');
const UserManager = require('../modules/User/UserManager');
const { isLoggedIn, hasPermission } = require('../utils');
var router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
    next()
})

//Get an array containing all test results for a certain sku item identified by RFID.
router.get('/api/skuitems/:rfid/testResults',
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.QUALITY_EMPLOYEE),
    param("rfid").isNumeric().isLength({ min: 32, max: 32 }),
    async function (req, res, next) {
        try {
            //param validation
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json(`validation of rfid failed`);
            }

            // Check if sku item exists
            const skuItem = await req.app.locals.skuManager.getSkuItemByRfid(req.params.rfid);
            if (skuItem === undefined) {
                return res.status(404).json("no SKU Item associated to rfid");
            }

            const testResults = await req.app.locals.skuManager.getTestResultsByRfid(req.params.rfid);
            return res.status(200).json(testResults)
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });

//Get a single test result for a certain sku item identified by RFID.
router.get('/api/skuitems/:rfid/testResults/:id',
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager, QUALITY_EMPLOYEE),
    param("rfid").isNumeric().isLength({ min: 32, max: 32 }),
    param("id").isInt(),
    async function (req, res, next) {
        try {
            //param validation
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json(`validation of id or of rfid failed`);
            }

            // Check if sku item or test result exist
            const skuItem = await req.app.locals.skuManager.getSkuItemByRfid(req.params.rfid);
            const testResult = await req.app.locals.skuManager.getTestResultByID(req.params.id);
            if (skuItem === undefined || testResult === undefined) {
                return res.status(404).json("no test result associated to id or no sku item associated to rfid");
            }

            const skuItemTestResult = await req.app.locals.skuManager.getSkuItemTestResultsByID(req.params.id, req.params.rfid);
            return res.status(200).json(skuItemTestResult)
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    });

//Creates a new test Result for a certain sku item identified by RFID.
router.post("/api/skuitems/testResult",
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.QUALITY_EMPLOYEE),
    body("rfid").isNumeric().isLength({ min: 32, max: 32 }),
    body("idTestDescriptor").isInt(),
    body("Result").isBoolean(),
    async function (req, res, next) {

        try {

            // Body Validation
            const date = req.body.Date;
            if (date != null && (!dayjs(date, "YYYY/MM/DD HH:MM", true).isValid() || !dayjs(date, "YYYY/MM/DD", true).isValid())) {
                return res.status(422).json(`validation of request body or of rfid failed`);
            }
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json(`validation of request body or of rfid failed`);
            }

            // Check if sku item or testDescriptor exist
            const skuItem = await req.app.locals.skuManager.getSkuItemByRfid(req.body.rfid);
            const testDescriptor = await req.app.locals.skuManager.getTestDescriptorByID(req.body.idTestDescriptor);
            if (skuItem === undefined || testDescriptor === undefined) {
                return res.status(404).json("no sku item associated to rfid or no test descriptor associated to idTestDescriptor");
            }


            await req.app.locals.skuManager.storeTestResult(req.body.rfid, req.body.idTestDescriptor, req.body.Date, req.body.Result);
            return res.status(201).json()
        }
        catch (err) {
            console.log(err);
            res.status(503).json(err);
        }
    });

//Modify a test Result identified by id for a certain sku item identified by RFID.
router.put('/api/skuitems/:rfid/testResult/:id',
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager, QUALITY_EMPLOYEE),
    param("rfid").isNumeric().isLength({ min: 32, max: 32 }),
    param("id").isInt(),
    body("newIdTestDescriptor").isInt(),
    body("newResult").isBoolean(),
    async function (req, res, next) {

        try {
            //param validation
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json(`validation of request body, of id or of rfid failed`);
            }

            // Check if sku item or test result exist
            const skuItem = await req.app.locals.skuManager.getSkuItemByRfid(req.params.rfid);
            const testDescriptor = await req.app.locals.skuManager.getTestDescriptorByID(req.body.newIdTestDescriptor);
            const testResult = await req.app.locals.skuManager.getTestResultByID(req.params.id);
            if (skuItem === undefined || testDescriptor === undefined || testResult === undefined) {
                return res.status(404).json(`no sku item associated to rfid or 
        no test descriptor associated to newIdTestDescriptor or 
        no test result associated to id`);
            }

            await req.app.locals.skuManager.modifyTestResult(req.params.id, req.params.rfid,
                req.body.newIdTestDescriptor, req.body.newDate, req.body.newResult);
            return res.status(200).json()
        }
        catch (err) {
            console.log(err);
            res.status(503).json(err);
        }
    });

//Delete a test result, given its id for a certain sku item identified by RFID.
router.delete('/api/skuitems/:rfid/testResult/:id',
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.QUALITY_EMPLOYEE),
    param("rfid").isNumeric().isLength({ min: 32, max: 32 }),
    param("id").isInt(),
    async function (req, res, next) {

        try {
            //param validation
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json(`validation of id or of rfid failed`);
            }

            await req.app.locals.skuManager.deleteTestResult(req.params.id, req.params.rfid);
            return res.status(204).json()
        }
        catch (err) {
            console.log(err);
            res.status(503).json(err);
        }
    });

module.exports = router;
