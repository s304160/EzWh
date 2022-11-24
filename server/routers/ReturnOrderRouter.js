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

//Return an array containing all return orders.
router.get('/api/returnOrders',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    async function (req, res) {
        try {
            let returnOrders = await req.app.locals.orderManager.getReturnOrders();
            return res.status(200).json(returnOrders);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });

//Return a return order, given its id.
router.get('/api/returnOrders/:id',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("id").isInt(),
    async function (req, res) {
        try {
            if (!validationResult(req).isEmpty())
                return res.status(422).json("validation of id failed");

            let returnOrder = await req.app.locals.orderManager.getReturnOrderByID(req.params.id);

            if (returnOrder === undefined)
                return res.status(404).json("no return order associated to id");

            return res.status(200).json(returnOrder);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });

//Creates a new return order.
router.post("/api/returnOrder",
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    body("products").notEmpty(),
    body("products.*.SKUId").isInt(),
    body("products.*.itemId").isInt(),
    body("products.*.description").isString(),
    body("products.*.price").isFloat(),
    body("products.*.RFID").isNumeric().isLength({ min: 32, max: 32 }),
    body("restockOrderId").isInt(),
    async function (req, res) {
        try {
            const date = req.body.returnDate;
            if (date != null && (!dayjs(date, "YYYY/MM/DD HH:MM", true).isValid() || !dayjs(date, "YYYY/MM/DD", true).isValid())) {
                return res.status(422).json(`validation of date failed`);
            }

            if (!validationResult(req).isEmpty())
                return res.status(422).json("validation of id failed");

            // req.body.products.forEach(async (p) => {
            //   let sku = await req.app.locals.skuManager.getSKUByID(p.SKUId);
            //   if (sku === undefined)
            //     return res.status(404).json("sku not found");
            //   let skuItem = await req.app.locals.skuManager.getSkuItemByRfid(p.RFID);
            //   if (skuItem === undefined)
            //     return res.status(404).json("skuItem not found");
            // });

            let restockOrder = await req.app.locals.orderManager.getRestockOrderByID(req.body.restockOrderId);

            if (restockOrder === undefined)
                return res.status(404).json("no restock order associated to restockOrderId");

            let returnOrders = await req.app.locals.orderManager.getReturnOrders();
            returnOrders.forEach(r => {
                if (r.getRestockOrder() == restockOrder.getID())
                    return res.status(404).json("restockOrderId already associated to a returnOrder");
            });

            await req.app.locals.orderManager.storeReturnOrder(
                req.body.returnDate,
                req.body.products,
                req.body.restockOrderId
            );

            return res.status(201).json();

        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });

//Delete a return order, given its id.
router.delete('/api/returnOrder/:id',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("id").isInt(),
    async function (req, res) {
        try {
            if (!validationResult(req).isEmpty())
                return res.status(422).json();


            await req.app.locals.orderManager.deleteReturnOrder(req.params.id);

            return res.status(204).json();

        }
        catch (err) {
            console.log(err);
            return res.status(503).json();
        }
    });

module.exports = router;
