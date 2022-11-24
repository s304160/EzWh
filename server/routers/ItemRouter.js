const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { isLoggedIn, hasPermission } = require('../utils');
const UserManager = require('../modules/User/UserManager');

// middleware that is specific to this router
router.use((req, res, next) => {
    next()
})


//Return an array containing all Items.
router.get("/api/items",
    isLoggedIn,
    hasPermission(UserManager.MANAGER, UserManager.SUPPLIER),
    async function (req, res) {
        try {
            let items = await req.app.locals.orderManager.getItems();
            // items = JSON.stringify(items,["id","description","price","SKUId","supplierId"])
            return res.status(200).send(items);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });



//Return an item, given its id.
router.get('/api/items/:id/:supplierID',
    isLoggedIn,
    hasPermission(UserManager.MANAGER),
    param("id").isInt(),
    param('supplierID').isInt(),
    async function (req, res) {
        try {
            if (!validationResult(req).isEmpty())
                return res.status(422).json("validation of id failed");

            let item = await req.app.locals.orderManager.getItemByIDAndSupplierID(req.params.id, req.params.supplierID);

            if (item === undefined)
                return res.status(404).json("no item associated to id");

            return res.status(200).send(item);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });



//Creates a new Item
router.post('/api/item',
    isLoggedIn,
    hasPermission(UserManager.SUPPLIER),
    body("id").isInt(),
    body("description").isString(),
    body("price").isFloat(),
    body("SKUId").isInt(),
    body("supplierId").isInt(),
    async function (req, res) {
        try {
            if (!validationResult(req).isEmpty())
                return res.status(422).json("validation of request body failed");

            const check = await req.app.locals.orderManager.checkSupplierSells(
                req.body.supplierId,
                req.body.SKUId,
                req.body.id
            );
            if (check) {
                return res.status(422).json(`this supplier already sells an item with the same SKUId 
        or supplier already sells an Item with the same ID`);
            }

            const sku = await req.app.locals.skuManager.getSKUByID(req.body.SKUId);
            if (sku === undefined) {
                return res.status(404).json("Sku not found");
            }

            await req.app.locals.orderManager.storeItem(
                req.body.id,
                req.body.description,
                req.body.price,
                req.body.SKUId,
                req.body.supplierId);

            return res.status(201).json();

        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });



//Modify an existing item.
router.put('/api/item/:id/:supplierID',
    isLoggedIn,
    hasPermission(UserManager.SUPPLIER),
    param("id").isInt(),
    body("newDescription").isString(),
    body("newPrice").isFloat(),
    param("supplierID").isInt(),
    async function (req, res) {
        try {
            if (!validationResult(req).isEmpty())
                return res.status(422).json("validation of request body failed");

            let item = await req.app.locals.orderManager.getItemByIDAndSupplierID(req.params.id, req.params.supplierID);

            if (item === undefined)
                return res.status(404).json("Item not existing");

            await req.app.locals.orderManager.modifyItem(
                req.params.id,
                req.body.newDescription,
                req.body.newPrice
            );

            return res.status(200).json();

        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });



//Delete an item receiving its id.
router.delete('/api/items/:id/:supplierID',
    isLoggedIn,
    hasPermission(UserManager.SUPPLIER),
    param("id").isInt(),
    param('supplierID').isInt(),
    async function (req, res) {
        try {
            if (!validationResult(req).isEmpty())
                return res.status(422).json("validation of id failed");

            await req.app.locals.orderManager.deleteItem(req.params.id);

            return res.status(204).json();
        }
        catch (err) {
            console.log(err);
            return res.status(503).json(err);
        }
    });

module.exports = router;
