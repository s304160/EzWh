const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const dayjs = require('dayjs');
const { isLoggedIn, hasPermission } = require('../utils');
const UserManager = require('../modules/User/UserManager');

// middleware that is specific to this router
router.use((req, res, next) => {
    next()
})


//Return an array containing all restock orders.
router.get('/api/restockOrders',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    async function (req, res) {
        try {
            let restockOrders = await req.app.locals.orderManager.getRestockOrders();

            return res.status(200).json(restockOrders);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });

//Returns an array of all restock orders in state = ISSUED. Example:
router.get('/api/restockOrdersIssued',
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.SUPPLIER),
    async function (req, res) {
        try {
            let restockOrdersIssued = await req.app.locals.orderManager.getRestockOrdersIssued();
            return res.status(200).json(restockOrdersIssued);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });

//Return a restock order, given its id.
router.get('/api/restockOrders/:id',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("id").isInt(),
    async function (req, res) {
        try {
            if (!validationResult(req).isEmpty())
                return res.status(422).json("validation of id failed");

            let restockOrder = await req.app.locals.orderManager.getRestockOrderByID(req.params.id);

            if (restockOrder === undefined)
                return res.status(404).json("no restock order associated to id");

            return res.status(200).json(restockOrder);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });

//Return sku items to be returned of a restock order, given its id. A sku item need to be returned if it haven't passed at least one quality test
router.get('/api/restockOrders/:id/returnItems',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("id").isInt(),
    async function (req, res) {
        try {
            let restockOrder = await req.app.locals.orderManager.getRestockOrderByID(req.params.id);

            if (restockOrder === undefined)
                return res.status(404).json("no restock order associated to id");

            if (!validationResult(req).isEmpty() ||
                restockOrder.getState() !== "COMPLETEDRETURN")
                return res.status(422).json("validation of id failed or restock order state != COMPLETEDRETURN");

            let returnItems = await req.app.locals.orderManager.getReturnItemsOfRestockOrder(req.params.id);

            return res.status(200).json(returnItems);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });

//Creates a new restock order in state = ISSUED with an empty list of skuItems.
router.post("/api/restockOrder",
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.SUPPLIER),
    body("products.*.SKUId").isInt(),
    body("products.*.itemId").isInt(),
    body("products.*.description").isString(),
    body("products.*.price").isFloat(),
    body("products.*.qty").isInt(),
    body("supplierId").isInt(),
    async function (req, res) {
        try {
            const date = req.body.issueDate;
            if (date != null && (!dayjs(date, "YYYY/MM/DD HH:MM", true).isValid() || !dayjs(date, "YYYY/MM/DD", true).isValid())) {
                return res.status(422).json(`validation of date failed`);
            }

            if (!validationResult(req).isEmpty())
                return res.status(422).json("validation of request body failed");

            await req.app.locals.orderManager.storeRestockOrder(
                req.body.issueDate,
                req.body.products,
                req.body.supplierId
            );

            return res.status(201).json();

        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });

//Modify the state of a restock order, given its id.
router.put('/api/restockOrder/:id',
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.CLERK),
    param("id").isInt(),
    body("newState").isString(),
    async function (req, res) {
        try {
            if (!validationResult(req).isEmpty())
                return res.status(422).json("validation of request body or of id failed");

            let restockOrder = await req.app.locals.orderManager.getRestockOrderByID(req.params.id);

            if (restockOrder === undefined)
                return res.status(404).json("no restock order associated to id");

            await req.app.locals.orderManager.modifyRestockOrderState(req.params.id, req.body.newState);

            return res.status(200).json();

        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });

//Add a non empty list of skuItems to a restock order, given its id. If a restock order has already a non empty list of skuItems, merge both arrays
router.put('/api/restockOrder/:id/skuItems',
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.CLERK),
    param("id").isInt(),
    body("skuItems").notEmpty(),
    body("skuItems.*.SKUId").isInt(),
    body("skuItems.*.itemId").isInt(),
    body("skuItems.*.rfid").isNumeric().isLength({ min: 32, max: 32 }),
    async function (req, res) {
        try {
            let restockOrder = await req.app.locals.orderManager.getRestockOrderByID(req.params.id);

            if (!validationResult(req).isEmpty())
                return res.status(422).json("validation of request body or of id failed or order state != DELIVERED");

            if (restockOrder === undefined)
                return res.status(404).json("no restock order associated to id");

            if (restockOrder.getState() !== "DELIVERED")
                return res.status(422).json("validation of request body or of id failed or order state != DELIVERED");

            await req.app.locals.orderManager.modifyRestockOrderSKUItems(req.params.id, req.body.skuItems);

            return res.status(200).json();

        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });

//Add a transport note to a restock order, given its id.
router.put('/api/restockOrder/:id/transportNote',
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.SUPPLIER),
    param("id").isInt(),
    body("transportNote.deliveryDate").isString(),
    async function (req, res) {
        try {
            if (!validationResult(req).isEmpty())
                return res.status(422).json(`validation of request body or of id failed`);

            const restockOrder = await req.app.locals.orderManager.getRestockOrderByID(req.params.id);
            if (restockOrder === undefined)
                return res.status(404).json("no restock order associated to id");

            if (restockOrder.getState() !== "DELIVERY" ||
                dayjs(req.body.transportNote.deliveryDate).isBefore(dayjs(restockOrder.getIssueDate())))
                return res.status(422).json(`order state != DELIVERY or deliveryDate is before issueDate`);



            await req.app.locals.orderManager.addRestockOrderTransportNote(req.params.id, req.body.transportNote.deliveryDate);

            return res.status(200).json();

        }
        catch (err) {
            console.log(err);
            return res.status(503).json();
        }
    });

//Delete a restock order, given its id.
router.delete('/api/restockOrder/:id',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("id").isInt(),
    async function (req, res) {
        try {
            if (!validationResult(req).isEmpty())
                return res.status(422).json("validation of id failed");

            await req.app.locals.orderManager.deleteRestockOrder(req.params.id);

            return res.status(204).json();

        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });

module.exports = router;
