const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const dayjs = require('dayjs');
const { isLoggedIn, hasPermission } = require('../utils');
const UserManager = require('../modules/User/UserManager');


//Return an array containing all internal orders.
router.get('/api/internalOrders',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    async function (req, res) {
        try {
            let internalOrders = await req.app.locals.orderManager.getInternalOrders();
            return res.status(200).json(internalOrders);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });



//Return an array containing all internal orders in state = ISSUED.
router.get('/api/internalOrdersIssued',
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.CUSTOMER),
    async function (req, res) {
        try {
            let internalOrdersIssued = await req.app.locals.orderManager.getInternalOrdersIssued();
            return res.status(200).json(internalOrdersIssued);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });



//Return an array containing all internal orders in state = ACCEPTED.
router.get('/api/internalOrdersAccepted',
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.DELIVERY_EMPLOYEE),
    async function (req, res) {
        try {
            let internalOrdersAccepted = await req.app.locals.orderManager.getInternalOrdersAccepted();
            return res.status(200).json(internalOrdersAccepted);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });



//Return an internal order, given its id.
router.get('/api/internalOrders/:id',
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.DELIVERY_EMPLOYEE),
    param("id").isInt(),
    async function (req, res) {
        try {
            if (!validationResult(req).isEmpty())
                return res.status(422).json("validation of id failed");

            let internalOrder = await req.app.locals.orderManager.getInternalOrderByID(req.params.id);

            if (internalOrder === undefined)
                return res.status(404).json("no internal order associated to id");

            return res.status(200).json(internalOrder);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });



//Creates a new internal order in state = ISSUED.
router.post("/api/internalOrders",
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.CUSTOMER),
    body("products.*.SKUId").isInt(),
    body("products.*.description").isString(),
    body("products.*.price").isFloat(),
    body("products.*.qty").isInt(),
    body("customerId").isInt(),
    async function (req, res) {
        try {
            if (!validationResult(req).isEmpty())
                return res.status(422).json("validation of request body failed");

            const date = req.body.issueDate;
            if (date != null && (!dayjs(date, "YYYY/MM/DD HH:MM", true).isValid() || !dayjs(date, "YYYY/MM/DD", true).isValid())) {
                return res.status(422).json(`validation of date failed`);
            }

            req.body.products.forEach(async (p) => {
                let sku = await req.app.locals.skuManager.getSKUByID(p.SKUId);
                if (sku === undefined)
                    return res.status(422).json("sku not found");
            });

            //implement check for uniqueness of sku id
            //(INTERNAL_ORDER_SKUITEM, PRIMARYKEY(skuID)

            await req.app.locals.orderManager.storeInternalOrder(
                req.body.issueDate,
                req.body.customerId,
                req.body.products
            );

            return res.status(201).json();

        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });



//Modify the state of an internal order, given its id. If newState is = COMPLETED an array of RFIDs is sent
router.put("/api/internalOrders/:id",
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.CUSTOMER, UserManager.DELIVERY_EMPLOYEE),
    param("id").exists().isInt(),
    body("newState").exists().isString(),
    body("products").custom((value, { req }) => {
        if (req.body.newState === "COMPLETED") {
            body("products.*.SkuID").isInt(),
                body("products.*.RFID").isAlphanumeric()
        }
        return true;
    }),
    async function (req, res) {
        try {
            if (!validationResult(req).isEmpty())
                return res.status(422).json("validation of request body or of id failed");

            let internalOrder = await req.app.locals.orderManager.getInternalOrderByID(req.params.id);
            if (internalOrder === undefined)
                return res.status(404).json("no internal order associated to id");

            await req.app.locals.orderManager.modifyInternalOrder(
                req.params.id,
                req.body.newState,
                req.body.products
            );

            return res.status(200).json();

        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });



//Delete an internal order, given its id.
router.delete('/api/internalOrders/:id',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("id").isInt(),
    async function (req, res) {
        try {
            if (!validationResult(req).isEmpty())
                return res.status(422).json("validation of id failed");

            await req.app.locals.orderManager.deleteInternalOrder(req.params.id);

            return res.status(204).json();

        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });

module.exports = router;
