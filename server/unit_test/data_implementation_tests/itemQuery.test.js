"use strict"
const DAO = require('../../modules/DataImplementation/DAO');
const test_item = require('./test_modules/test_item');

const itemDB = new DAO(`./unit_test/data_implementation_tests/test_databases/testDB_item.sqlite`);

    describe('item tests', () => {
        beforeAll(async () => {
            await itemDB.destroyDB()
             .then(itemDB.startDB())
    })

    describe('store and get new item', () => {
        beforeAll(async () => {
            await itemDB.deleteItems();
        })
        test_item.test_isCleanDB(itemDB);
        test_item.test_storeItem(itemDB, 1, "item1", 2, 10, 11);
        test_item.test_getItems(itemDB, 1);
    })


    describe('modify item', () => {
        beforeAll(async () => {
            await itemDB.deleteItems();
        })
        test_item.test_isCleanDB(itemDB);
        test_item.test_storeItem(itemDB, 1, "item1", 2, 10, 11);
        test_item.test_modifyItem(itemDB, 1, "item2", 3);
    })

    describe('check supplier sells', () => {
        beforeAll(async () => {
            await itemDB.deleteItems();
        })
        test_item.test_isCleanDB(itemDB);
        test_item.test_storeItem(itemDB, 1, "item1", 2, 10, 11);
        test_item.test_checkSupplierSells(itemDB, 11, 10, 1);
    })

    describe('delete item', () => {
        beforeAll(async () => {
            await itemDB.deleteItems();
        })
        test_item.test_isCleanDB(itemDB);
        test_item.test_storeItem(itemDB, 1, "item1", 2, 10, 11);
        test_item.test_deleteItem(itemDB, 1);
    })


});