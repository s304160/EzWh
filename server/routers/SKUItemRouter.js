var express = require('express');
var router = express.Router();
const { body, param, validationResult } = require('express-validator');
const dayjs = require('dayjs');
const { isLoggedIn, hasPermission } = require('../utils');
const UserManager = require('../modules/User/UserManager');

// middleware that is specific to this router
router.use((req, res, next) => {
    next()
})

//Get SKU items
router.get("/api/skuitems",
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    async function (req, res, next) {

        try {
            const skuItems = await req.app.locals.skuManager.getSkuItems();
            return res.status(200).json(skuItems);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }

    });

//Get SKUItems of a specific SKU
router.get('/api/skuitems/sku/:id',
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.CUSTOMER),
    param("id").isInt(),
    async function (req, res, next) {
        try {
            // Param validation
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json(`validation of id failed`);
            }

            // Check if sku exists
            const SKU = await req.app.locals.skuManager.getSKUByID(req.params.id);
            if (SKU === undefined) {
                return res.status(404).json("no SKU associated to id");
            }

            const skuItems = await req.app.locals.skuManager.getSkuItemsAvailable();
            return res.status(200).json(skuItems);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });

//Get a SKU item, given its RFID.
router.get('/api/skuitems/:rfid',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("rfid").isNumeric().isLength({ min: 32, max: 32 }),
    async function (req, res, next) {

        try {
            // Param validation
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json(`validation of rfid failed`);
            }

            const skuItem = await req.app.locals.skuManager.getSkuItemByRfid(req.params.rfid);
            if (skuItem === undefined) {
                return res.status(404).json("no SKU Item associated to rfid");
            }

            return res.status(200).json(skuItem);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });

//Create new SKUItem
router.post('/api/skuitem',
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.CLERK),
    body("RFID").isNumeric().isLength({ min: 32, max: 32 }),
    body("SKUId").isInt(),
    //body("DateOfStock").isDate(),
    async function (req, res, next) {
        try {
            // Body validation
            const date = req.body.DateOfStock;
            if (date != null && (!dayjs(date, "YYYY/MM/DD HH:MM", true).isValid() || !dayjs(date, "YYYY/MM/DD", true).isValid())) {
                return res.status(422).json(`validation of date failed`);
            }
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json(`validation of request body failed`);
            }

            // Check if sku exists
            const SKU = await req.app.locals.skuManager.getSKUByID(req.body.SKUId);
            if (SKU === undefined) {
                return res.status(404).json("no SKU associated to SKUId");
            }

            await req.app.locals.skuManager.storeSkuItem(req.body.RFID, 0, req.body.SKUId, req.body.DateOfStock);
            return res.status(201).json();
        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });

//Modify RFID
router.put('/api/skuitems/:rfid',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("rfid").isNumeric().isLength({ min: 32, max: 32 }),
    body("newRFID").isNumeric().isLength({ min: 32, max: 32 }),
    body("newAvailable").isInt(),
    async function (req, res, next) {
        try {
            // Body and params validation
            const date = req.body.newDateOfStock;
            if (date != null && (!dayjs(date, "YYYY/MM/DD HH:MM", true).isValid() || !dayjs(date, "YYYY/MM/DD", true).isValid())) {
                return res.status(422).json(`validation of date failed`);
            }
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json(`validation of request body or of rfid failed`);
            }

            // Check if sku item exists
            const skuItem = await req.app.locals.skuManager.getSkuItemByRfid(req.params.rfid);
            if (skuItem === undefined) {
                return res.status(404).json("no SKU Item associated to rfid");
            }

            await req.app.locals.skuManager.modifySkuItem(skuItem, req.body.newRFID, req.body.newAvailable, req.body.newDateOfStock);
            return res.status(200).json();
        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });

//Delete an SKUItem by its RFID
router.delete('/api/skuitems/:rfid',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("rfid").isNumeric().isLength({ min: 32, max: 32 }),
    async function (req, res, next) {

        try {
            // params validation
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json(`validation of rfid failed`);
            }

            await req.app.locals.skuManager.deleteSkuItem(req.params.rfid);
            return res.status(204).json();
        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });

module.exports = router;
